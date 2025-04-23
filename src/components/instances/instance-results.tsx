"use client"

import { useState } from "react"
import { Search, ChevronRight, FileText, CheckCircle, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

// Mock data for completed questionnaire instances
const mockInstances = [
  {
    id: "inst-1",
    title: "Annual Security Assessment 2024",
    template: "Security Assessment",
    completedBy: "John Smith",
    completedDate: "2024-03-15",
    score: 85,
    maxScore: 100,
    status: "Compliant",
  },
  {
    id: "inst-2",
    title: "Q1 GDPR Compliance Check",
    template: "GDPR Compliance",
    completedBy: "Sarah Johnson",
    completedDate: "2024-02-20",
    score: 72,
    maxScore: 100,
    status: "Compliant",
  },
  {
    id: "inst-3",
    title: "Server Room Security Audit",
    template: "Security Assessment",
    completedBy: "Michael Brown",
    completedDate: "2024-01-10",
    score: 65,
    maxScore: 100,
    status: "Non-Compliant",
  },
  {
    id: "inst-4",
    title: "New Employee Data Protection Training",
    template: "GDPR Compliance",
    completedBy: "Emily Davis",
    completedDate: "2024-03-05",
    score: 90,
    maxScore: 100,
    status: "Compliant",
  },
  {
    id: "inst-5",
    title: "IT Infrastructure Assessment",
    template: "IT Infrastructure",
    completedBy: "Robert Wilson",
    completedDate: "2024-02-28",
    score: 78,
    maxScore: 100,
    status: "Compliant",
  },
  {
    id: "inst-6",
    title: "Customer Data Handling Review",
    template: "GDPR Compliance",
    completedBy: "Jennifer Lee",
    completedDate: "2024-01-25",
    score: 58,
    maxScore: 100,
    status: "Non-Compliant",
  },
]

// Mock data for instance details
const mockInstanceDetails = {
  "inst-1": {
    title: "Annual Security Assessment 2024",
    template: "Security Assessment",
    completedBy: "John Smith",
    completedDate: "2024-03-15",
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
          {
            question: "Are privileged accounts managed separately from standard user accounts?",
            answer: "Yes, with additional controls",
            score: 10,
            maxScore: 10,
          },
          {
            question: "Is there a formal process for granting and revoking access?",
            answer: "Yes, but not fully documented",
            score: 7,
            maxScore: 10,
          },
          {
            question: "Are inactive accounts disabled after a defined period?",
            answer: "Yes, after 60 days",
            score: 8,
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
          {
            question: "Is there a data classification policy?",
            answer: "Yes, but not consistently applied",
            score: 7,
            maxScore: 10,
          },
          {
            question: "Is data access logged and monitored?",
            answer: "Partially implemented",
            score: 5,
            maxScore: 10,
          },
          {
            question: "Is there a data retention policy?",
            answer: "Yes, fully implemented",
            score: 8,
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
  "inst-3": {
    title: "Server Room Security Audit",
    template: "Security Assessment",
    completedBy: "Michael Brown",
    completedDate: "2024-01-10",
    score: 65,
    maxScore: 100,
    status: "Non-Compliant",
    sections: [
      {
        title: "Physical Security",
        score: 30,
        maxScore: 50,
        questions: [
          {
            question: "Is access to the server room restricted to authorized personnel?",
            answer: "Yes, but access logs are not regularly reviewed",
            score: 7,
            maxScore: 10,
          },
          {
            question: "Are there surveillance cameras monitoring the server room?",
            answer: "Yes, but coverage is incomplete",
            score: 6,
            maxScore: 10,
          },
          {
            question: "Is there a fire suppression system in place?",
            answer: "Yes, fully functional",
            score: 10,
            maxScore: 10,
          },
          {
            question: "Is environmental monitoring in place (temperature, humidity)?",
            answer: "Partial monitoring only",
            score: 5,
            maxScore: 10,
          },
          {
            question: "Is there an uninterruptible power supply (UPS)?",
            answer: "Yes, but capacity is insufficient",
            score: 2,
            maxScore: 10,
          },
        ],
      },
      {
        title: "Access Controls",
        score: 35,
        maxScore: 50,
        questions: [
          {
            question: "Is multi-factor authentication required for server room access?",
            answer: "No",
            score: 0,
            maxScore: 10,
          },
          {
            question: "Is there a visitor log maintained?",
            answer: "Yes, but not consistently used",
            score: 5,
            maxScore: 10,
          },
          {
            question: "Are access rights reviewed regularly?",
            answer: "No regular reviews",
            score: 0,
            maxScore: 10,
          },
          {
            question: "Is there an emergency access procedure?",
            answer: "Yes, documented and tested",
            score: 10,
            maxScore: 10,
          },
          {
            question: "Are server cabinets locked?",
            answer: "Most are locked, some are not",
            score: 7,
            maxScore: 10,
          },
        ],
      },
    ],
    recommendations: [
      "Implement multi-factor authentication for server room access",
      "Establish regular access rights review process",
      "Upgrade UPS capacity to support full server load",
      "Improve camera coverage in server room",
      "Ensure consistent use of visitor logs",
    ],
  },
}

export function InstanceResults() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null)

  // Filter instances based on search query
  const filteredInstances = mockInstances.filter(
    (instance) =>
      instance.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instance.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instance.completedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instance.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get details for selected instance
  const instanceDetails = selectedInstance
    ? mockInstanceDetails[selectedInstance as keyof typeof mockInstanceDetails]
    : null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Completed Instances</CardTitle>
            <CardDescription>View results of completed questionnaires</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search instances..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              {filteredInstances.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-2" />
                  <p>No instances found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredInstances.map((instance) => (
                    <div
                      key={instance.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedInstance === instance.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedInstance(instance.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{instance.title}</h4>
                          <p className="text-sm opacity-90">{instance.template}</p>
                        </div>
                        <ChevronRight
                          className={`h-5 w-5 ${
                            selectedInstance === instance.id ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <Badge
                          variant={
                            selectedInstance === instance.id
                              ? "outline"
                              : instance.status === "Compliant"
                                ? "default"
                                : "destructive"
                          }
                          className={selectedInstance === instance.id ? "border-primary-foreground" : ""}
                        >
                          {instance.status}
                        </Badge>
                        <span className="text-sm">
                          {instance.score}/{instance.maxScore}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {!selectedInstance || !instanceDetails ? (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Select an instance to view details</h3>
              <p className="text-muted-foreground mt-2">
                Click on a questionnaire instance from the list to view its results
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{instanceDetails.title}</CardTitle>
                  <CardDescription>
                    Completed by {instanceDetails.completedBy} on{" "}
                    {new Date(instanceDetails.completedDate).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant={instanceDetails.status === "Compliant" ? "default" : "destructive"} className="ml-auto">
                  {instanceDetails.status}
                </Badge>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Overall Score</span>
                  <span>
                    {instanceDetails.score}/{instanceDetails.maxScore}
                  </span>
                </div>
                <Progress value={(instanceDetails.score / instanceDetails.maxScore) * 100} />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {instanceDetails.sections.map((section, index) => (
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
                        {section.questions.map((question, qIndex) => (
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
                      {index < instanceDetails.sections.length - 1 && <Separator className="my-6" />}
                    </div>
                  ))}

                  {instanceDetails.recommendations && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                        <ul className="space-y-2">
                          {instanceDetails.recommendations.map((rec, index) => (
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
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
