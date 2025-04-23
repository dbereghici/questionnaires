"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Plus, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Question, AnswerOption, AnswerType } from "@/components/questionnaire-page"

interface QuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (question: Omit<Question, "id">) => void
  initialData: Question | null
}

export function QuestionModal({ isOpen, onClose, onSubmit, initialData }: QuestionModalProps) {
  const [content, setContent] = useState("")
  const [extraContent, setExtraContent] = useState("")
  const [answerType, setAnswerType] = useState<AnswerType>("text")
  const [options, setOptions] = useState<AnswerOption[]>([])
  const [attachments, setAttachments] = useState<string[]>([])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && initialData) {
      setContent(initialData.content)
      setExtraContent(initialData.extraContent || "")
      setAnswerType(initialData.answerType)
      setOptions(initialData.options || [])
      setAttachments(initialData.attachments || [])
    } else if (!isOpen) {
      resetForm()
    }
  }, [isOpen, initialData])

  const resetForm = () => {
    setContent("")
    setExtraContent("")
    setAnswerType("text")
    setOptions([])
    setAttachments([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const questionData: Omit<Question, "id"> = {
      content,
      extraContent: extraContent || undefined,
      answerType,
      options: answerType === "option" || answerType === "multi-option" ? options : undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
    }

    onSubmit(questionData)
  }

  const addOption = () => {
    const newOption: AnswerOption = {
      id: `option-${Date.now()}`,
      text: "",
      score: 0,
    }
    setOptions([...options, newOption])
  }

  const updateOption = (id: string, field: keyof AnswerOption, value: string | number) => {
    setOptions(options.map((option) => (option.id === id ? { ...option, [field]: value } : option)))
  }

  const removeOption = (id: string) => {
    setOptions(options.filter((option) => option.id !== id))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setAttachments([...attachments, ...newFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Question" : "Add New Question"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="content">Question Content</Label>
              <Input
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter question content"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="extraContent">Extra Content (Optional)</Label>
              <Textarea
                id="extraContent"
                value={extraContent}
                onChange={(e) => setExtraContent(e.target.value)}
                placeholder="Additional information about the question"
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="answerType">Answer Type</Label>
              <Select value={answerType} onValueChange={(value: AnswerType) => setAnswerType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select answer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="option">Single Option</SelectItem>
                  <SelectItem value="multi-option">Multiple Options</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(answerType === "option" || answerType === "multi-option") && (
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <Label>Answer Options</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>
                    <Plus className="h-4 w-4 mr-2" /> Add Option
                  </Button>
                </div>

                {options.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No options yet. Add options and assign scores.</p>
                ) : (
                  options.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <Input
                        value={option.text}
                        onChange={(e) => updateOption(option.id, "text", e.target.value)}
                        placeholder="Option text"
                        className="flex-1"
                      />
                      <div className="flex items-center gap-2 w-[120px]">
                        <Label htmlFor={`score-${option.id}`} className="text-sm whitespace-nowrap">
                          Score:
                        </Label>
                        <Input
                          id={`score-${option.id}`}
                          type="number"
                          value={option.score}
                          onChange={(e) => updateOption(option.id, "score", Number(e.target.value))}
                          className="w-16"
                        />
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(option.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label>Attach Files (Optional)</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload Files
                </Button>
                <Input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} multiple />
              </div>

              {attachments.length > 0 && (
                <div className="grid gap-2 mt-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm border p-2 rounded">
                      <span className="truncate">{file.split("/").pop()}</span>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeAttachment(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!content.trim()}>
              {initialData ? "Update Question" : "Add Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
