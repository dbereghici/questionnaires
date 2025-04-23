"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuestionnairePreview } from "@/components/questionnaire-preview"
import { AlertTriangle } from "lucide-react"
import { templateData } from "@/lib/mock-data"

export default function QuestionnairePage() {
  const params = useParams()
  const router = useRouter()
  const [instance, setInstance] = useState<any | null>(null)
  const [questionnaire, setQuestionnaire] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const instanceId = params.id as string

  useEffect(() => {
    // Load instance data
    const storedInstances = localStorage.getItem("sent_questionnaires")
    if (storedInstances) {
      try {
        const parsedInstances = JSON.parse(storedInstances)
        const foundInstance = parsedInstances.find((inst: any) => inst.id === instanceId)

        if (foundInstance) {
          setInstance(foundInstance)

          // Update status to "opened" if it's currently "sent"
          if (foundInstance.status === "sent") {
            const updatedInstance = {
              ...foundInstance,
              status: "opened",
              openedDate: new Date().toISOString(),
            }

            const updatedInstances = parsedInstances.map((inst: any) =>
              inst.id === instanceId ? updatedInstance : inst,
            )

            localStorage.setItem("sent_questionnaires", JSON.stringify(updatedInstances))
            setInstance(updatedInstance)
          }

          // Load template data
          if (foundInstance.templateId && templateData[foundInstance.templateId]) {
            setQuestionnaire({
              title: templateData[foundInstance.templateId].title,
              sections: templateData[foundInstance.templateId].sections,
            })
          } else {
            setError("Template not found")
          }
        } else {
          setError("Questionnaire not found")
        }
      } catch (error) {
        console.error("Error loading instance:", error)
        setError("Error loading questionnaire data")
      }
    } else {
      setError("Questionnaire not found")
    }

    setLoading(false)
  }, [instanceId])

  const handleSubmit = () => {
    if (!instance) return

    // Update instance status to completed
    const storedInstances = localStorage.getItem("sent_questionnaires")
    if (storedInstances) {
      try {
        const parsedInstances = JSON.parse(storedInstances)

        // Generate random score between 60 and 100
        const score = Math.floor(Math.random() * 41) + 60
        const isCompliant = score >= 75

        const updatedInstance = {
          ...instance,
          status: "completed",
          completedDate: new Date().toISOString(),
          score: score,
          maxScore: 100,
          isCompliant: isCompliant,
        }

        const updatedInstances = parsedInstances.map((inst: any) => (inst.id === instanceId ? updatedInstance : inst))

        localStorage.setItem("sent_questionnaires", JSON.stringify(updatedInstances))
        setSubmitted(true)
      } catch (error) {
        console.error("Error updating instance:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="py-12 text-center">
            <p>Loading questionnaire...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
            <p className="text-lg mb-6">Your questionnaire has been submitted successfully.</p>
            <Button onClick={() => window.close()}>Close Window</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (instance?.status === "completed") {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-bold mb-2">This questionnaire has already been completed</h2>
            <p className="text-muted-foreground">Thank you for your participation.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{questionnaire?.title}</CardTitle>
          <CardDescription>
            Please complete this questionnaire. Your responses will be saved when you submit.
          </CardDescription>
        </CardHeader>

        {questionnaire && <QuestionnairePreview questionnaire={questionnaire} />}

        <CardFooter className="flex justify-end pt-6">
          <Button onClick={handleSubmit}>Submit Questionnaire</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
