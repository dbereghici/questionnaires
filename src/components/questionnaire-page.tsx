"use client"

import { useState, useEffect } from "react"
import { Pencil, Plus, Trash2, Eye, MoveDown, MoveUp, FileQuestion, GripVertical, Save, ArrowLeft } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

import { QuestionModal } from "@/components/question-modal"
import { SectionModal } from "@/components/section-modal"
import { QuestionnairePreview } from "@/components/questionnaire-preview"
import { Badge } from "@/components/ui/badge"

// Define types
export type AnswerOption = {
  id: string
  text: string
  score: number
}

export type AnswerType = "text" | "number" | "option" | "multi-option"

export type Question = {
  id: string
  content: string
  extraContent?: string
  answerType: AnswerType
  options?: AnswerOption[]
  attachments?: string[]
}

export type Section = {
  id: string
  title: string
  description?: string
  questions: Question[]
}

export type Questionnaire = {
  title: string
  sections: Section[]
  lastSaved?: string
}

// Local Storage Key
const STORAGE_KEY = "questionnaire_data"

// Sortable Question Item Component
function SortableQuestionItem({
  question,
  section,
  onEdit,
  onDelete,
}: {
  question: Question
  section: Section
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} className="py-2 px-3 border rounded-md mb-2 flex justify-between items-start">
      <div className="flex items-center">
        <div className="cursor-grab mr-2 text-muted-foreground hover:text-foreground" {...attributes} {...listeners}>
          <GripVertical className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="font-medium flex items-center space-x-2">
            <span>{question.content}</span>
            <Badge variant="outline">{question.answerType}</Badge>
          </div>
          {question.extraContent && <p className="text-sm text-muted-foreground mt-1">{question.extraContent}</p>}
          {question.options && question.options.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Options:</span>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {question.options.map((option) => (
                  <div key={option.id} className="text-xs">
                    {option.text} <span className="text-muted-foreground">(score: {option.score})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-1">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

interface QuestionnairePageProps {
  initialQuestionnaire: Questionnaire
}

export function QuestionnairePage({ initialQuestionnaire }: QuestionnairePageProps) {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>(initialQuestionnaire)

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState<Section | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [activeTab, setActiveTab] = useState("editor")

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Save questionnaire to localStorage whenever it changes
  useEffect(() => {
    if (questionnaire.sections.length > 0) {
      const updatedQuestionnaire = {
        ...questionnaire,
        lastSaved: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuestionnaire))
      setQuestionnaire(updatedQuestionnaire)
    }
  }, [questionnaire.title, questionnaire.sections])

  // Manual save function
  const handleSave = () => {
    const updatedQuestionnaire = {
      ...questionnaire,
      lastSaved: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuestionnaire))
    setQuestionnaire(updatedQuestionnaire)

    // toast({
    //   title: "Questionnaire saved",
    //   description: "Your questionnaire has been saved to local storage.",
    // })
  }

  // Update questionnaire title
  const updateTitle = (title: string) => {
    setQuestionnaire((prev) => ({
      ...prev,
      title,
    }))
  }

  // Add a new section
  const addSection = (section: Omit<Section, "id" | "questions">) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      questions: [],
      ...section,
    }

    setQuestionnaire((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }))
  }

  // Add a question to a section
  const addQuestion = (sectionId: string, question: Omit<Question, "id">) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      ...question,
    }

    setQuestionnaire((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, questions: [...section.questions, newQuestion] } : section,
      ),
    }))
  }

  // Update an existing question
  const updateQuestion = (sectionId: string, questionId: string, updatedQuestion: Omit<Question, "id">) => {
    setQuestionnaire((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId ? { ...updatedQuestion, id: questionId } : q,
              ),
            }
          : section,
      ),
    }))
  }

  // Delete a question
  const deleteQuestion = (sectionId: string, questionId: string) => {
    setQuestionnaire((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, questions: section.questions.filter((q) => q.id !== questionId) }
          : section,
      ),
    }))
  }

  // Delete a section
  const deleteSection = (sectionId: string) => {
    setQuestionnaire((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }))
  }

  // Move section up
  const moveSectionUp = (index: number) => {
    if (index === 0) return

    setQuestionnaire((prev) => {
      const newSections = [...prev.sections]
      const temp = newSections[index]
      newSections[index] = newSections[index - 1]
      newSections[index - 1] = temp

      return {
        ...prev,
        sections: newSections,
      }
    })
  }

  // Move section down
  const moveSectionDown = (index: number) => {
    if (index >= questionnaire.sections.length - 1) return

    setQuestionnaire((prev) => {
      const newSections = [...prev.sections]
      const temp = newSections[index]
      newSections[index] = newSections[index + 1]
      newSections[index + 1] = temp

      return {
        ...prev,
        sections: newSections,
      }
    })
  }

  // Handle drag end for questions
  const handleDragEnd = (event: DragEndEvent, sectionId: string) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setQuestionnaire((prev) => {
        const section = prev.sections.find((s) => s.id === sectionId)
        if (!section) return prev

        const oldIndex = section.questions.findIndex((q) => q.id === active.id)
        const newIndex = section.questions.findIndex((q) => q.id === over.id)

        const newSections = prev.sections.map((s) => {
          if (s.id === sectionId) {
            const newQuestions = [...s.questions]
            const [movedQuestion] = newQuestions.splice(oldIndex, 1)
            newQuestions.splice(newIndex, 0, movedQuestion)
            return { ...s, questions: newQuestions }
          }
          return s
        })

        return {
          ...prev,
          sections: newSections,
        }
      })
    }
  }

  // Handle opening the question modal
  const handleOpenQuestionModal = (sectionId: string, question: Question | null = null) => {
    setCurrentSection(questionnaire.sections.find((s) => s.id === sectionId) || null)
    setCurrentQuestion(question)
    setIsQuestionModalOpen(true)
  }

  // Handle question submission
  const handleQuestionSubmit = (question: Omit<Question, "id">) => {
    if (currentSection) {
      if (currentQuestion) {
        // Update existing question
        updateQuestion(currentSection.id, currentQuestion.id, question)
      } else {
        // Add new question
        addQuestion(currentSection.id, question)
      }
    }
    setIsQuestionModalOpen(false)
  }

  // Handle section submission
  const handleSectionSubmit = (section: Omit<Section, "id" | "questions">) => {
    addSection(section)
    setIsSectionModalOpen(false)
  }

  // Format the last saved date
  const formatLastSaved = (dateString?: string) => {
    if (!dateString) return "Not saved yet"

    const date = new Date(dateString)
    return `Last saved: ${date.toLocaleTimeString()} on ${date.toLocaleDateString()}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/questionnaires">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Questionnaire Designer</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <Input
                value={questionnaire.title}
                onChange={(e) => updateTitle(e.target.value)}
                className="text-2xl font-bold h-auto py-1 px-2 bg-transparent border-0 border-b border-dashed focus-visible:border-solid"
              />
              <CardDescription className="mt-1 flex justify-between">
                <span>Create and organize your questionnaire sections and questions</span>
                <span className="text-xs text-muted-foreground">{formatLastSaved(questionnaire.lastSaved)}</span>
              </CardDescription>
            </div>
            <Button onClick={handleSave} className="shrink-0">
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="p-0">
              <div className="flex justify-end mb-4">
                <Button onClick={() => setIsSectionModalOpen(true)} className="mr-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Section
                </Button>
                <Button onClick={() => setActiveTab("preview")} variant="outline">
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </Button>
              </div>

              <ScrollArea className="h-[600px] pr-4">
                {questionnaire.sections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FileQuestion className="h-16 w-16 mb-4" />
                    <p>No sections yet. Add a section to get started.</p>
                  </div>
                ) : (
                  questionnaire.sections.map((section, sectionIndex) => (
                    <Card key={section.id} className="mb-6">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{section.title}</CardTitle>
                            <CardDescription>{section.description}</CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => moveSectionUp(sectionIndex)}
                              disabled={sectionIndex === 0}
                            >
                              <MoveUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => moveSectionDown(sectionIndex)}
                              disabled={sectionIndex === questionnaire.sections.length - 1}
                            >
                              <MoveDown className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => deleteSection(section.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(event) => handleDragEnd(event, section.id)}
                        >
                          <SortableContext
                            items={section.questions.map((q) => q.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {section.questions.map((question) => (
                              <SortableQuestionItem
                                key={question.id}
                                question={question}
                                section={section}
                                onEdit={() => handleOpenQuestionModal(section.id, question)}
                                onDelete={() => deleteQuestion(section.id, question.id)}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                        <Button
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => handleOpenQuestionModal(section.id)}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Question
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="preview" className="pt-0">
              <div className="flex justify-end mb-4">
                <Button onClick={() => setActiveTab("editor")} variant="outline">
                  Back to Editor
                </Button>
              </div>
              <QuestionnairePreview questionnaire={questionnaire} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Question Modal */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSubmit={handleQuestionSubmit}
        initialData={currentQuestion}
      />

      {/* Section Modal */}
      <SectionModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        onSubmit={handleSectionSubmit}
      />
    </div>
  )
}
