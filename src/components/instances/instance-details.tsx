"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FileText, Copy, CheckCircle, AlertTriangle, Mail, Clock, ExternalLink } from "lucide-react"

// Mock template data
const templateData: Record<string, any> = {
  "template-1": {
    title: "Security Assessment",
    description: "Evaluate security controls and identify vulnerabilities",
    sections: [
      {
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

// Mock completed questionnaire data
const mockCompletedData: Record<string, any> = {
  "inst-example": {
    score: 85,
    maxScore: 100,
    status: "Compliant",
    sections: [
      {
        title: "Access Controls",
        score: 45,
        maxScore: 50,
        questions: [
          {
            question: "Are user access rights reviewed regularly?",
            answer: "Yes, quarterly or more frequently",
            score: 10,
            maxScore: 10,
          },
          {
            question: "Is multi-factor authentication implemented for critical systems?",
            answer: "Yes, for all critical systems",
            score: 10,
            maxScore: 10,
          },
        ],
      },
      {
        title: "Data Protection",
        score: 40,
        maxScore: 50,
        questions: [
          {
            question: "Is sensitive data encrypted at rest?",
            answer: "Yes, all sensitive data",
            score: 10,
            maxScore: 10,
          },
          {
            question: "Are regular data backups performed?",
            answer: "Yes, daily",
            score: 10,
            maxScore: 10,
          },
        ],
      },
    ],
    recommendations: [
      "Improve documentation for access management processes",
      "Extend data access logging to all sensitive systems",
      "Review and update data classification implementation",
    ],
  },
}

interface InstanceDetailsProps {
  instanceId: string | null
  instances: any[]
  onUpdateInstance: (updatedInstance: any) => void
}

export function InstanceDetails({ instanceId, instances, onUpdateInstance }: InstanceDetailsProps) {
  const [instance, setInstance] = useState<any | null>(null)
  const [templateInfo, setTemplateInfo] = useState<any | null>(null)

  // Find the selected instance
  useEffect(() => {
    if (!instanceId) {
      setInstance(null)
      setTemplateInfo(null)
      return
    }

    const foundInstance = instances.find((inst) => inst.id === instanceId)
    setInstance(foundInstance || null)

    if (foundInstance) {
      // Get template info
      const template = templateData[foundInstance.templateId]
      setTemplateInfo(template || null)
    }
  }, [instanceId, instances])

  // Function to copy URL to clipboard
  const copyUrlToClipboard = () => {
    if (!instance) return

    navigator.clipboard.writeText(instance.url)
    // toast({
    //   title: "URL copied",
    //   description: "Questionnaire URL has been copied to clipboard",
    // })
  }

  // Function to simulate opening the questionnaire
  const simulateOpen = () => {
    if (!instance || instance.status === "completed") return

    const updatedInstance = {
      ...instance,
      status: "opened",
      openedDate: new Date().toISOString(),
    }

    onUpdateInstance(updatedInstance)
    // toast({
    //   title: "Status updated",
    //   description: "Questionnaire status updated to 'opened'",
    // })
  }

  // Function to simulate completing the questionnaire
  const simulateComplete = () => {
    if (!instance || instance.status === "completed") return

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
      completedData: mockCompletedData["inst-example"], // Using mock data
    }

    onUpdateInstance(updatedInstance)
    // toast({
    //   title: "Status updated",
    //   description: "Questionnaire status updated to 'completed'",
    // })
  }

  // Get status icon based on instance status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Mail className="h-5 w-5 text-blue-500" />
      case "opened":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Mail className="h-5 w-5 text-blue-500" />
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (!instanceId) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Select an instance to view details</h3>
          <p className="text-muted-foreground mt-2">
            Click on a questionnaire instance from the list to view its details
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!instance) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <AlertTriangle className="mx-auto h-16 w-16 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium">Instance not found</h3>
          <p className="text-muted-foreground mt-2">The selected questionnaire instance could not be found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>{instance.title}</CardTitle>
              <Badge variant={instance.status === "completed" ? "default" : "secondary"} className="capitalize">
                {instance.status}
              </Badge>
            </div>
            <CardDescription className="mt-1">
              Sent to {instance.email} on {formatDate(instance.sentDate)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">{getStatusIcon(instance.status)}</div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Questionnaire URL</span>
            <Button variant="ghost" size="sm" onClick={copyUrlToClipboard}>
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
          </div>
          <div className="flex items-center mt-1 p-2 bg-muted rounded-md text-sm">
            <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground truncate">{instance.url}</span>
          </div>
        </div>

        {instance.status !== "completed" && (
          <div className="flex flex-wrap gap-2 mt-4">
            {instance.status === "sent" && (
              <Button variant="outline" size="sm" onClick={simulateOpen}>
                <Clock className="h-4 w-4 mr-2" /> Simulate Open
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={simulateComplete}>
              <CheckCircle className="h-4 w-4 mr-2" /> Simulate Completion
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {instance.status === "completed" ? (
            // Show detailed results for completed questionnaires
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Overall Score</span>
                  <div className="flex items-center gap-2">
                    <span>
                      {instance.score}/{instance.maxScore}
                    </span>
                    {instance.isCompliant ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                </div>
                <Progress value={(instance.score / instance.maxScore) * 100} />
                <div className="flex justify-end mt-1">
                  <Badge variant={instance.isCompliant ? "default" : "destructive"}>
                    {instance.isCompliant ? "Compliant" : "Non-Compliant"}
                  </Badge>
                </div>
              </div>

              <Separator />

              {instance.completedData?.sections.map((section: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">{section.title}</h3>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">
                        {section.score}/{section.maxScore}
                      </span>
                      {section.score / section.maxScore >= 0.7 ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                  </div>
                  <Progress value={(section.score / section.maxScore) * 100} className="mb-4" />
                  <div className="space-y-4">
                    {section.questions.map((question: any, qIndex: number) => (
                      <div key={qIndex} className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{question.question}</h4>
                          <span className="text-sm">
                            {question.score}/{question.maxScore}
                          </span>
                        </div>
                        <p className="text-sm mt-1">
                          <span className="text-muted-foreground">Answer: </span>
                          {question.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                  {index < instance.completedData.sections.length - 1 && <Separator className="my-6" />}
                </div>
              ))}

              {instance.completedData?.recommendations && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                    <ul className="space-y-2">
                      {instance.completedData.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Show simple preview for non-completed questionnaires
            <div className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">{templateInfo?.title || instance.title}</h3>
                <p className="text-muted-foreground mb-4">{templateInfo?.description || "No description available"}</p>

                {templateInfo?.sections && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Sections:</h4>
                    {templateInfo.sections.map((section: any, index: number) => (
                      <div key={index} className="pl-4 border-l-2 border-muted">
                        <h5 className="font-medium">{section.title}</h5>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                        <p className="text-sm mt-1">
                          {section.questions.length} question{section.questions.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 text-center text-muted-foreground">
                  <p>This questionnaire has not been completed yet.</p>
                  <p className="text-sm mt-1">Questions will be displayed after completion.</p>
                </div>
              </div>

              <div className="border rounded-md p-4 bg-muted/30">
                <h4 className="font-medium mb-2">Status Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="font-medium">Sent</span>
                    <span className="ml-auto text-sm text-muted-foreground">{formatDate(instance.sentDate)}</span>
                  </div>

                  {instance.status === "opened" || instance.status === "completed" ? (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="font-medium">Opened</span>
                      <span className="ml-auto text-sm text-muted-foreground">
                        {instance.openedDate ? formatDate(instance.openedDate) : "N/A"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Not yet opened</span>
                    </div>
                  )}

                  {instance.status === "completed" ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-medium">Completed</span>
                      <span className="ml-auto text-sm text-muted-foreground">
                        {instance.completedDate ? formatDate(instance.completedDate) : "N/A"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Not yet completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
