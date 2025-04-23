"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import type { Question, Questionnaire } from "@/components/questionnaire-page"

interface QuestionnairePreviewProps {
  questionnaire: Questionnaire
}

export function QuestionnairePreview({ questionnaire }: QuestionnairePreviewProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})

  const currentSection = questionnaire.sections[currentSectionIndex]

  const handleNextSection = () => {
    if (currentSectionIndex < questionnaire.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1)
    }
  }

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1)
    }
  }

  const handleTextResponse = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleNumberResponse = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value === "" ? "" : Number(value),
    }))
  }

  const handleSingleOptionResponse = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleMultiOptionResponse = (questionId: string, optionId: string, checked: boolean) => {
    setResponses((prev) => {
      const currentValues = Array.isArray(prev[questionId]) ? [...prev[questionId]] : []

      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentValues, optionId],
        }
      } else {
        return {
          ...prev,
          [questionId]: currentValues.filter((id: string) => id !== optionId),
        }
      }
    })
  }

  // Render proper input based on question type
  const renderQuestionInput = (question: Question) => {
    const response = responses[question.id]

    switch (question.answerType) {
      case "text":
        return (
          <Textarea
            value={response || ""}
            onChange={(e) => handleTextResponse(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="mt-2"
          />
        )
      case "number":
        return (
          <Input
            type="number"
            value={response === undefined ? "" : response}
            onChange={(e) => handleNumberResponse(question.id, e.target.value)}
            placeholder="Enter a number"
            className="mt-2 max-w-xs"
          />
        )
      case "option":
        return (
          <RadioGroup
            value={response || ""}
            onValueChange={(value) => handleSingleOptionResponse(question.id, value)}
            className="mt-4 space-y-3"
          >
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id}>{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "multi-option":
        return (
          <div className="mt-4 space-y-3">
            {question.options?.map((option) => {
              const isChecked = Array.isArray(response) && response.includes(option.id)

              return (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={isChecked}
                    onCheckedChange={(checked) => handleMultiOptionResponse(question.id, option.id, checked as boolean)}
                  />
                  <Label htmlFor={option.id}>{option.text}</Label>
                </div>
              )
            })}
          </div>
        )
      default:
        return null
    }
  }

  if (questionnaire.sections.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No sections in the questionnaire yet</h3>
            <p className="text-muted-foreground mt-2">Add sections and questions to preview your questionnaire</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentSection || currentSection.questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">
                Section {currentSectionIndex + 1} of {questionnaire.sections.length}
              </div>
              <CardTitle>{currentSection?.title || "Section"}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No questions in this section</h3>
            <p className="text-muted-foreground mt-2">Add questions to this section to preview it</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" onClick={handlePreviousSection} disabled={currentSectionIndex === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous Section
          </Button>
          <Button onClick={handleNextSection} disabled={currentSectionIndex === questionnaire.sections.length - 1}>
            Next Section <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">
              Section {currentSectionIndex + 1} of {questionnaire.sections.length}
            </div>
            <CardTitle>{currentSection.title}</CardTitle>
            {currentSection.description && <p className="text-muted-foreground mt-1">{currentSection.description}</p>}
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="space-y-8">
          {currentSection.questions.map((question, index) => (
            <div key={question.id} className="pb-6 border-b last:border-b-0 last:pb-0">
              <h3 className="text-lg font-medium mb-2">
                {index + 1}. {question.content}
              </h3>
              {question.extraContent && <p className="text-muted-foreground mb-4">{question.extraContent}</p>}
              {question.attachments && question.attachments.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Attachments:</h4>
                  <div className="flex flex-wrap gap-2">
                    {question.attachments.map((attachment, i) => (
                      <div key={i} className="border rounded p-2 text-sm">
                        {attachment.split("/").pop()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>{renderQuestionInput(question)}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="outline" onClick={handlePreviousSection} disabled={currentSectionIndex === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Previous Section
        </Button>
        <Button onClick={handleNextSection} disabled={currentSectionIndex === questionnaire.sections.length - 1}>
          Next Section <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}
