import os
import logging
from anthropic import Anthropic

# Initialize Anthropic client
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
client = Anthropic(api_key=ANTHROPIC_API_KEY)

# Nenad's professional information extracted from resume
NENAD_INFO = """
Nenad Mahesh Gowda
Contact: +91 9960865675 | nenadgowda@gmail.com | linkedin.com/in/nenad-gowda/

EDUCATION:
- B.Tech. Mechanical Engineering, Manipal Institute of Technology, Manipal (CGPA: 7.0, June 2025)
- 12th Grade: Lexicon International, CBSE (85%, March 2021)
- 10th Grade: Lexicon International, CBSE (87%, March 2019)

EXPERIENCE:
1. Leadsquared - BFSI Sales Development Representative Intern (Dec 2024 - June 2025), Bengaluru
   - Achieved 100% of monthly sales targets for six consecutive months
   - Generated 2 million in ARR through targeted multi-channel outreach
   - Qualified and nurtured 300+ high-value BFSI leads, boosting pipeline velocity by 25%
   - Automated 800+ outreach touchpoints, reducing manual effort by 50%
   - Improved demo-to-close conversion by 25%
   - Enhanced demo scheduling efficiency by 20%

2. Dolta - Business Analyst (Oct 2021 - Sept 2022), Pune
   - Conducted market research across 20+ industries
   - Analyzed and qualified 250+ B2B leads, driving 20% increase in client conversion
   - Maintained records of 300+ client interactions for real-time KPI tracking
   - Reduced average lead cycle time by 15%

PROJECTS:
- Founder of Upscale Analytics: Agency providing investor-ready pitch decks and dynamic financial models for university startups

SKILLS:
- Business Development and Sales
- CRM Management (LeadSquared)
- Market Research and Analysis
- Lead Generation and Qualification
- Data-driven Decision Making
- Cross-functional Collaboration
- B2B Sales and BFSI sector expertise
"""

def get_chatbot_response(user_message):
    """
    Generate chatbot response using Anthropic Claude based on Nenad's professional information
    """
    try:
        # the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=500,
            temperature=0.7,
            system=f"""You are a professional assistant representing Nenad Mahesh Gowda for his portfolio website. 
            You help recruiters and potential employers learn about Nenad's background, experience, and qualifications.
            
            Here is Nenad's professional information:
            {NENAD_INFO}
            
            Guidelines:
            - Be professional, concise, and helpful
            - Answer questions about Nenad's experience, education, skills, and achievements
            - If asked about something not in his resume, politely say you don't have that information
            - Encourage recruiters to contact him directly for detailed discussions
            - Highlight his key achievements: 100% sales target achievement, 2M ARR generation, 25% pipeline improvement
            - Be enthusiastic about his potential and career growth
            - Keep responses conversational but professional""",
            messages=[
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )
        
        return response.content[0].text.strip()
    
    except Exception as e:
        logging.error(f"Error getting chatbot response: {str(e)}")
        return "I apologize, but I'm experiencing technical difficulties. Please feel free to contact Nenad directly at nenadgowda@gmail.com or +91 9960865675."
