// Mock template data
export const templateData: Record<string, any> = {
    "template-1": {
      title: "Security Assessment",
      description: "Evaluate security controls and identify vulnerabilities",
      sections: [
        {
          id: "section-1",
          title: "Access Controls",
          description: "Evaluate access control mechanisms",
          questions: [
            {
              id: "q1",
              content: "Are user access rights reviewed regularly?",
              extraContent: "This should be done at least quarterly",
              answerType: "option",
              options: [
                { id: "opt1", text: "Yes, quarterly or more frequently", score: 10 },
                { id: "opt2", text: "Yes, but less frequently than quarterly", score: 5 },
                { id: "opt3", text: "No, not regularly reviewed", score: 0 },
              ],
            },
            {
              id: "q2",
              content: "Is multi-factor authentication implemented for critical systems?",
              answerType: "option",
              options: [
                { id: "opt1", text: "Yes, for all critical systems", score: 10 },
                { id: "opt2", text: "Partially implemented", score: 5 },
                { id: "opt3", text: "No", score: 0 },
              ],
            },
          ],
        },
        {
          id: "section-2",
          title: "Data Protection",
          description: "Assess data protection measures",
          questions: [
            {
              id: "q3",
              content: "Is sensitive data encrypted at rest?",
              answerType: "option",
              options: [
                { id: "opt1", text: "Yes, all sensitive data", score: 10 },
                { id: "opt2", text: "Partially", score: 5 },
                { id: "opt3", text: "No", score: 0 },
              ],
            },
            {
              id: "q4",
              content: "Are regular data backups performed?",
              answerType: "option",
              options: [
                { id: "opt1", text: "Yes, daily", score: 10 },
                { id: "opt2", text: "Yes, weekly", score: 7 },
                { id: "opt3", text: "Yes, monthly", score: 3 },
                { id: "opt4", text: "No regular backups", score: 0 },
              ],
            },
          ],
        },
      ],
    },
    "template-2": {
      title: "GDPR Compliance",
      description: "Assess compliance with GDPR regulations",
      sections: [
        {
          id: "section-1",
          title: "Data Subject Rights",
          description: "Compliance with data subject rights requirements",
          questions: [
            {
              id: "q1",
              content: "Do you have procedures to handle data subject access requests?",
              answerType: "option",
              options: [
                { id: "opt1", text: "Yes, documented and tested", score: 10 },
                { id: "opt2", text: "Yes, but not formally documented", score: 5 },
                { id: "opt3", text: "No", score: 0 },
              ],
            },
            {
              id: "q2",
              content: "What is your typical response time for data subject requests?",
              extraContent: "GDPR requires responses within one month",
              answerType: "option",
              options: [
                { id: "opt1", text: "Less than 2 weeks", score: 10 },
                { id: "opt2", text: "2-4 weeks", score: 7 },
                { id: "opt3", text: "1-2 months", score: 3 },
                { id: "opt4", text: "More than 2 months", score: 0 },
              ],
            },
          ],
        },
      ],
    },
    "template-3": {
      title: "IT Infrastructure",
      description: "Evaluate IT infrastructure and systems",
      sections: [
        {
          id: "section-1",
          title: "Server Infrastructure",
          description: "Assess server configuration and management",
          questions: [
            {
              id: "q1",
              content: "Are servers regularly patched?",
              answerType: "option",
              options: [
                { id: "opt1", text: "Yes, monthly or more frequently", score: 10 },
                { id: "opt2", text: "Yes, quarterly", score: 7 },
                { id: "opt3", text: "Yes, but less frequently than quarterly", score: 3 },
                { id: "opt4", text: "No regular patching", score: 0 },
              ],
            },
          ],
        },
      ],
    },
    "template-4": {
      title: "Employee Onboarding",
      description: "Checklist for new employee onboarding process",
      sections: [
        {
          id: "section-1",
          title: "Documentation",
          description: "Required documentation for new employees",
          questions: [
            {
              id: "q1",
              content: "Has the employee completed all required paperwork?",
              answerType: "option",
              options: [
                { id: "opt1", text: "Yes, all paperwork complete", score: 10 },
                { id: "opt2", text: "Partially complete", score: 5 },
                { id: "opt3", text: "No, paperwork incomplete", score: 0 },
              ],
            },
          ],
        },
      ],
    },
    "template-5": {
      title: "Customer Satisfaction",
      description: "Survey to measure customer satisfaction and feedback",
      sections: [
        {
          id: "section-1",
          title: "Service Quality",
          description: "Assess quality of service provided",
          questions: [
            {
              id: "q1",
              content: "How would you rate our service quality?",
              answerType: "option",
              options: [
                { id: "opt1", text: "Excellent", score: 10 },
                { id: "opt2", text: "Good", score: 7 },
                { id: "opt3", text: "Average", score: 5 },
                { id: "opt4", text: "Poor", score: 2 },
                { id: "opt5", text: "Very Poor", score: 0 },
              ],
            },
          ],
        },
      ],
    },
  }
  