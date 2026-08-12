import logging
from typing import Optional, Dict, Any, List
from app.core.config import settings

logger = logging.getLogger("claude_service")

# Fallback financial knowledge base if Anthropic API key is not configured
FALLBACK_KNOWLEDGE: Dict[str, str] = {
    "what is this app": (
        "Welcome to FinSight AI Financial Intelligence! 🚀\n\n"
        "Here are the core features you can use right now:\n"
        "1. 📈 Live Markets & Interactive Charts: Real-time price tracking for Gold (NEM, Barrick, FNV, SLV), US Tech, Indian Equities (Reliance, Tata, TCS), and Cryptos.\n"
        "2. 💼 Virtual Portfolio Trading: ₹10,00,000 virtual balance to buy and sell stocks, commodities, and crypto risk-free.\n"
        "3. 🤖 FinSight AI Intelligence Copilot: Ask AI about stock valuations, market sentiment, or audit your exact portfolio risk.\n"
        "4. 🔔 Real-Time Price Target Alerts: Instant notifications when stock target prices are hit.\n"
        "5. 🎓 Academy & Economic Calendar: Market replay simulator, inflation event calendar, and backtesting tools."
    ),
    "features": (
        "FinSight AI Core Features:\n"
        "• Live Market Quotes: Real-time yfinance stock feeds & WebSocket price streaming every 4s.\n"
        "• Virtual Trading: Buy & sell stocks with ₹10,00,000 initial virtual cash.\n"
        "• Portfolio AI Audit: Live risk assessment of your connected holdings & liquidity.\n"
        "• Price Alerts: Customizable price target notifications.\n"
        "• Market Simulator: Backtest trading strategies across historic crashes & bull runs."
    ),
    "fnv": "Franco-Nevada Gold Royalties (FNV) is the premier gold-focused royalty and streaming company with a market cap over ₹2.1 Trillion. Royalty companies earn cash flows on mined gold without taking on operational mining cost inflation risks.",
    "gold": "Gold Spot is trading at ₹9,800/unit. Gold mining leaders include Barrick Gold (GOLD), Newmont Corp (NEM - world's largest gold miner), and Franco-Nevada (FNV). Gold serves as a premier physical hedge against inflation and currency depreciation.",
    "nem": "Newmont Corporation (NEM) is the world's largest gold mining corporation, operating tier-one mining assets in North America, South America, Africa, and Australia.",
    "barrick": "Barrick Gold Corporation (GOLD) is one of the world's leading gold and copper producers, operating major mining complexes globally.",
    "silver": "Silver (SLV) is both a monetary precious metal and a vital industrial metal heavily used in solar photovoltaics, electronics, and electric vehicle production.",
    "oil": "WTI Crude Oil (USO) is the global benchmark energy commodity powering transport, manufacturing, and petrochemical industries.",
    "reliance": "Reliance Industries Ltd. (RELIANCE.NS) is India's largest conglomerate by market cap (₹20+ Trillion), operating Oil-to-Chemicals refining, Jio Telecom, and Reliance Retail.",
    "tata": "Tata Motors (TATAMOTORS.BO) is a premier global automotive manufacturer owning Jaguar Land Rover and leading India's commercial & electric vehicle market.",
    "nvidia": "NVIDIA Corporation (NVDA) is the global leader in AI accelerated computing and graphics processing units (GPUs) powering ChatGPT, Gemini, and enterprise AI supercomputers.",
    "apple": "Apple Inc. (AAPL) is trading near record highs, driven by iPhone 16 sales, M-series Silicon chips, and $60B+ annual stock buyback programs.",
    "bitcoin": "Bitcoin (BTC) is a decentralized digital currency with a hard-capped total supply of 21 million coins, operating on a peer-to-peer blockchain network.",
    "what is bitcoin": "Bitcoin (BTC) is a decentralized digital currency created in 2009. Unlike fiat currency issued by central banks, Bitcoin operates on a distributed peer-to-peer blockchain network with a hard capped supply of 21 million coins.",
    "why is tesla stock going up": "Tesla stock (TSLA) performance is heavily influenced by delivery volumes, autonomous Robotaxi testing milestones, battery technology margins, and broader EV market sentiment.",
    "explain inflation to me in simple terms": "Inflation means your money buys less over time. If a coffee costs ₹100 today and ₹110 next year, inflation is 10%. To prevent inflation from eroding savings, investors put money into productive assets like equities, real estate, or gold.",
    "what should a beginner invest in": "Beginners typically start with a 3-part framework:\n1. Emergency Fund: 3-6 months cash in high-yield savings.\n2. Low-Cost Index Funds: Broad market index exposure (e.g., S&P 500 or Nifty 50).\n3. Defensive Assets: 5-10% allocation to gold or fixed income.",
    "how does the stock market work": "The stock market is a public exchange where buyers and sellers trade fractional ownership shares of companies. Stock prices fluctuate based on market demand, quarterly revenue, earnings growth, and broader economic conditions.",
    "what's the difference between stocks and bonds": "• Stocks: Fractional ownership of a corporation offering higher growth potential with market risk.\n• Bonds: Fixed-income loans to a government or corporation providing predictable interest income."
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
                "You are FinSight AI, a world-class financial copilot and market assistant for the FinSight platform. "
                "You provide clear, accurate, concise financial guidance, stock market insights, gold/commodity analysis, and portfolio evaluation. "
                "Maintain a professional yet encouraging tone."
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
            logger.warning(f"Claude API call failed: {e}. Falling back to internal engine.")

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
        f"FinSight AI Analysis for '{cleaned_query}':\n"
        f"Global markets prioritize sustained cash flows, earnings growth, and risk management. "
        f"Always evaluate corporate fundamentals, P/E ratio valuation, and technical market momentum before executing trades."
    )
