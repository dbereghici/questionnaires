"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, FileQuestion, Eye, Send } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock data for questionnaire templates
const templates = [
  {
    id: "template-1",
    title: "Security Assessment",
    description: "Evaluate security controls and identify vulnerabilities",
    sections: 5,
    questions: 25,
    category: "Security",
    lastUpdated: "2023-12-15",
  },
  {
    id: "template-2",
    title: "GDPR Compliance",
    description: "Assess compliance with GDPR regulations",
    sections: 6,
    questions: 30,
    category: "Compliance",
    lastUpdated: "2023-11-20",
  },
  {
    id: "template-3",
    title: "IT Infrastructure",
    description: "Evaluate IT infrastructure and systems",
    sections: 4,
    questions: 20,
    category: "IT",
    lastUpdated: "2024-01-05",
  },
  {
    id: "template-4",
    title: "Employee Onboarding",
    description: "Checklist for new employee onboarding process",
    sections: 3,
    questions: 15,
    category: "HR",
    lastUpdated: "2023-10-10",
  },
  {
    id: "template-5",
    title: "Customer Satisfaction",
    description: "Survey to measure customer satisfaction and feedback",
    sections: 4,
    questions: 18,
    category: "Customer",
    lastUpdated: "2024-02-01",
  },
]

export default function QuestionnairesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [recipientEmail, setRecipientEmail] = useState("")

  // Filter templates based on search query
  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get the selected template details
  const selectedTemplateDetails = selectedTemplate ? templates.find((t) => t.id === selectedTemplate) : null

  // Handle sending the questionnaire
  const handleSendQuestionnaire = () => {
    if (!selectedTemplate || !recipientEmail) return

    // Generate a unique ID for the instance
    const instanceId = `inst-${Date.now()}`

    // Get existing sent questionnaires from localStorage or initialize empty array
    const existingSent = JSON.parse(localStorage.getItem("sent_questionnaires") || "[]")

    // Create new instance object
    const newInstance = {
      id: instanceId,
      templateId: selectedTemplate,
      title: selectedTemplateDetails?.title || "",
      email: recipientEmail,
      status: "sent",
      sentDate: new Date().toISOString(),
      url: `${window.location.origin}/questionnaire/${instanceId}`,
    }

    // Add to localStorage
    localStorage.setItem("sent_questionnaires", JSON.stringify([...existingSent, newInstance]))

    // Close dialog and show success message
    setIsSendDialogOpen(false)
    setRecipientEmail("")
    setSelectedTemplate(null)

    // toast({
    //   title: "Questionnaire sent",
    //   description: `The questionnaire has been sent to ${recipientEmail}`,
    // })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Questionnaire Templates</h1>
        <p className="text-muted-foreground">Select a template to send to recipients</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No templates found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search query</p>
          <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle>{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between py-1">
                    <span>Sections:</span>
                    <span>{template.sections}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Questions:</span>
                    <span>{template.questions}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Last Updated:</span>
                    <span>{new Date(template.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(template.id)
                      setIsSendDialogOpen(true)
                    }}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/questionnaire-designer?template=${template.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Send Questionnaire Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Questionnaire</DialogTitle>
            <DialogDescription>
              Send the {selectedTemplateDetails?.title} questionnaire to a recipient via email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">Recipient Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter recipient email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Template</Label>
              <div className="p-3 border rounded-md">
                <h4 className="font-medium">{selectedTemplateDetails?.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedTemplateDetails?.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{selectedTemplateDetails?.category}</Badge>
                  <span className="text-xs text-muted-foreground">{selectedTemplateDetails?.questions} questions</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!recipientEmail.trim() || !selectedTemplate} onClick={handleSendQuestionnaire}>
              <Send className="mr-2 h-4 w-4" />
              Send Questionnaire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
