"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { QuestionnairePage } from "@/components/questionnaire-page"
import type { Questionnaire } from "@/components/questionnaire-page"

// Mock template data
const templateData: Record<string, Questionnaire> = {
  "template-1": {
    title: "Security Assessment",
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
}

export default function QuestionnaireDesignerPage() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")
  const questId = searchParams.get("id")
  const isNew = searchParams.get("new") === "true"
  const name = searchParams.get("name")

  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null)

  useEffect(() => {
    // Load template data if specified
    if (templateId && templateData[templateId]) {
      const template = templateData[templateId]
      setQuestionnaire({
        ...template,
        title: name || `Copy of ${template.title}`,
      })
    }
    // Load existing questionnaire if ID is provided
    else if (questId) {
      // In a real app, you would fetch the questionnaire data from an API
      // For now, we'll just use localStorage
      const savedData = localStorage.getItem(`questionnaire_${questId}`)
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          setQuestionnaire(parsedData)
        } catch (error) {
          console.error("Error loading questionnaire data:", error)
          setQuestionnaire({
            title: "New Questionnaire",
            sections: [],
          })
        }
      } else {
        setQuestionnaire({
          title: "New Questionnaire",
          sections: [],
        })
      }
    }
    // Create a new blank questionnaire
    else {
      setQuestionnaire({
        title: name || "New Questionnaire",
        sections: [],
      })
    }
  }, [templateId, questId, name, isNew])

  if (!questionnaire) {
    return <div className="flex items-center justify-center h-[80vh]">Loading...</div>
  }

  return <QuestionnairePage initialQuestionnaire={questionnaire} />
}
