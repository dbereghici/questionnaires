"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, FileQuestion, MoreHorizontal, Copy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

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

// Mock data for user questionnaires
const userQuestionnaires = [
  {
    id: "user-1",
    title: "Annual Security Review",
    description: "Based on Security Assessment template",
    sections: 5,
    questions: 28,
    lastUpdated: "2024-02-10",
    status: "Draft",
  },
  {
    id: "user-2",
    title: "Q1 GDPR Audit",
    description: "Quarterly GDPR compliance check",
    sections: 6,
    questions: 32,
    lastUpdated: "2024-01-15",
    status: "Complete",
  },
  {
    id: "user-3",
    title: "Server Room Assessment",
    description: "Physical security assessment of server rooms",
    sections: 3,
    questions: 15,
    lastUpdated: "2023-12-20",
    status: "In Progress",
  },
]

export default function QuestionnairesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("my-questionnaires")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newQuestionnaireName, setNewQuestionnaireName] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // Filter questionnaires based on search query
  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredUserQuestionnaires = userQuestionnaires.filter(
    (questionnaire) =>
      questionnaire.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      questionnaire.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Questionnaires</h1>
          <p className="text-muted-foreground">Create and manage your questionnaires</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questionnaires..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="my-questionnaires" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="my-questionnaires">My Questionnaires</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="my-questionnaires" className="space-y-4 pt-4">
          {filteredUserQuestionnaires.length === 0 ? (
            <div className="text-center py-12">
              <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No questionnaires found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery ? "Try adjusting your search query" : "Create your first questionnaire to get started"}
              </p>
              {searchQuery && (
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredUserQuestionnaires.map((questionnaire) => (
                <Card key={questionnaire.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center">
                          {questionnaire.title}
                          <Badge
                            variant={
                              questionnaire.status === "Complete"
                                ? "default"
                                : questionnaire.status === "In Progress"
                                  ? "outline"
                                  : "secondary"
                            }
                            className="ml-2"
                          >
                            {questionnaire.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{questionnaire.description}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Link href={`/questionnaire-designer?id=${questionnaire.id}`} className="flex w-full">
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex justify-between py-1">
                        <span>Sections:</span>
                        <span>{questionnaire.sections}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Questions:</span>
                        <span>{questionnaire.questions}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Last Updated:</span>
                        <span>{new Date(questionnaire.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/questionnaire-designer?id=${questionnaire.id}`}>Open</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="templates" className="space-y-4 pt-4">
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
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template.id)
                          setNewQuestionnaireName(`Copy of ${template.title}`)
                          setIsCreateDialogOpen(true)
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Use Template
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/questionnaire-designer?template=${template.id}`}>Preview</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create New Questionnaire Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Questionnaire</DialogTitle>
            <DialogDescription>
              {selectedTemplate
                ? "Create a new questionnaire based on the selected template."
                : "Create a new questionnaire from scratch or select a template."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Questionnaire Name</Label>
              <Input
                id="name"
                placeholder="Enter questionnaire name"
                value={newQuestionnaireName}
                onChange={(e) => setNewQuestionnaireName(e.target.value)}
              />
            </div>
            {!selectedTemplate && (
              <div className="space-y-2">
                <Label>Template (Optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3 px-4"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Blank</span>
                      <span className="text-xs text-muted-foreground">Start from scratch</span>
                    </div>
                  </Button>
                  {templates.slice(0, 3).map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      className={`justify-start h-auto py-3 px-4 ${
                        selectedTemplate === template.id ? "border-primary" : ""
                      }`}
                      onClick={() => {
                        setSelectedTemplate(template.id)
                        if (!newQuestionnaireName) {
                          setNewQuestionnaireName(`Copy of ${template.title}`)
                        }
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{template.title}</span>
                        <span className="text-xs text-muted-foreground">{template.category}</span>
                      </div>
                    </Button>
                  ))}
                </div>
                {templates.length > 3 && (
                  <Button
                    variant="link"
                    className="px-0 h-auto"
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      setActiveTab("templates")
                    }}
                  >
                    View all templates
                  </Button>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!newQuestionnaireName.trim()}
              onClick={() => {
                // Here you would create the new questionnaire
                setIsCreateDialogOpen(false)
                // Redirect to questionnaire designer
                window.location.href = `/questionnaire-designer?new=true${
                  selectedTemplate ? `&template=${selectedTemplate}` : ""
                }&name=${encodeURIComponent(newQuestionnaireName)}`
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
