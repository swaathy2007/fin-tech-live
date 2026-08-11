import logging
from typing import Optional, Dict, Any, List
from app.core.config import settings

logger = logging.getLogger("claude_service")

# Fallback financial knowledge base if Anthropic API key is not configured
FALLBACK_KNOWLEDGE: Dict[str, str] = {
    "what is bitcoin": "Bitcoin (BTC) is a decentralized digital currency created in 2009. Unlike fiat currency issued by central banks, Bitcoin operates on a distributed peer-to-peer blockchain network with a hard capped supply of 21 million coins, making it a popular digital store of value.",
    "why is tesla stock going up": "Tesla stock (TSLA) performance is heavily influenced by delivery volumes, autonomous Robotaxi testing milestones, battery technology margins, and broader EV market sentiment.",
    "explain inflation to me in simple terms": "Inflation means your money buys less over time. If a coffee costs ₹100 today and ₹110 next year, inflation is 10%. To prevent inflation from eroding savings, investors put money into productive assets like equities, real estate, or inflation-indexed bonds.",
    "what should a beginner invest in": "Beginners typically start with a 3-part framework:\n1. Emergency Fund: 3-6 months cash in high-yield savings.\n2. Low-Cost Index Funds: Broad market index exposure (e.g., S&P 500 or Nifty 50).\n3. Defensive Assets: 5-10% allocation to gold or fixed income.",
    "how does the stock market work": "The stock market is a public exchange where buyers and sellers trade fractional ownership shares of companies. Stock prices fluctuate based on market demand, quarterly revenue, earnings growth, and broader economic conditions.",
    "what's the difference between stocks and bonds": "• Stocks: Fractional ownership of a corporation. Offers higher capital growth potential, but comes with higher market volatility.\n• Bonds: Fixed-income loans to a government or corporation. Offers predictable interest payments with lower capital risk."
}

async def generate_claude_response(
    message: str,
    mode: str = "chat",
    portfolio_context: Optional[Dict[str, Any]] = None,
    user_name: Optional[str] = "Investor"
) -> str:
    cleaned_query = message.strip()
    
    # 1. Try invoking Anthropic API if key is set
    if settings.ANTHROPIC_API_KEY and len(settings.ANTHROPIC_API_KEY) > 10:
        try:
            import anthropic
            client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

            system_instruction = (
                "You are FinSight AI, a world-class financial copilot and market assistant. "
                "You provide clear, accurate, concise financial guidance, stock market insights, and portfolio evaluation. "
                "Maintain a professional yet encouraging tone. Never provide illegal insider advice, but offer practical principles."
            )

            if mode == "learning":
                system_instruction += (
                    "\n\n[MODE: LEARNING]\n"
                    "Explain financial concepts in simple, plain language (ELI5 style). "
                    "Use bullet points, clear analogies, and avoid overly dense jargon without defining it."
                )
            elif mode == "analysis" and portfolio_context:
                balance = portfolio_context.get("available_balance", 0)
                holdings = portfolio_context.get("holdings", [])
                total_val = portfolio_context.get("total_portfolio_value", 0)
                
                holdings_summary = ", ".join(
                    [f"{h.get('symbol')}: {h.get('quantity')} units @ avg price ₹{h.get('buy_price')}" for h in holdings]
                ) if holdings else "No active holdings."

                system_instruction += (
                    f"\n\n[MODE: PORTFOLIO ANALYSIS]\n"
                    f"User Portfolio Data:\n"
                    f"- Total Value: ₹{total_val:,.2f}\n"
                    f"- Available Cash Balance: ₹{balance:,.2f}\n"
                    f"- Current Holdings: {holdings_summary}\n"
                    "Analyze the user's asset allocation, risk concentration, and balance utilization. "
                    "Provide actionable portfolio optimization suggestions."
                )

            response = await client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                system=system_instruction,
                messages=[
                    {"role": "user", "content": cleaned_query}
                ]
            )
            
            if response and response.content:
                return response.content[0].text
        except Exception as e:
            logger.warning(f"Claude API call failed or failed to parse: {e}. Falling back to internal engine.")

    # 2. Local Fallback Generator
    lower_query = cleaned_query.lower()
    for key, ans in FALLBACK_KNOWLEDGE.items():
        if key in lower_query:
            return ans

    if "portfolio" in lower_query or "holding" in lower_query or "audit" in lower_query or mode == "analysis":
        if portfolio_context:
            bal = portfolio_context.get("available_balance", 1000000)
            tot = portfolio_context.get("total_portfolio_value", 1000000)
            h_count = len(portfolio_context.get("holdings", []))
            return (
                f"FinSight Portfolio Intelligence Audit:\n"
                f"• Total Portfolio Value: ₹{tot:,.2f}\n"
                f"• Cash Liquidity: ₹{bal:,.2f}\n"
                f"• Active Positions: {h_count}\n\n"
                f"Strategy Insight: Ensure adequate diversification across asset classes (equities, digital assets, commodities). "
                f"Maintain cash reserves for strategic market dips."
            )
        return (
            "FinSight Copilot: Portfolio auditing requires connected holdings. "
            "Your virtual portfolio is currently monitored for asset concentration, risk tolerance, and downside exposure."
        )

    if mode == "learning":
        return (
            f"Learning Mode Explanation: In finance, '{cleaned_query}' relates to capital allocation and market dynamics. "
            f"Financial instruments allow investors to preserve purchasing power and build long-term wealth relative to cash inflation."
        )

    return (
        f"FinSight AI Intelligence: Regarding '{cleaned_query}', global markets prioritize sustained cash flows, revenue growth, and risk management. "
        f"Always evaluate corporate earnings, valuation metrics, and market momentum before executing trading strategies."
    )
