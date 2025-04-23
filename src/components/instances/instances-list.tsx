"use client"

import { useState } from "react"
import { Search, FileText, ChevronRight, Mail, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Template data for reference
const templateData: Record<string, { title: string; category: string }> = {
  "template-1": { title: "Security Assessment", category: "Security" },
  "template-2": { title: "GDPR Compliance", category: "Compliance" },
  "template-3": { title: "IT Infrastructure", category: "IT" },
  "template-4": { title: "Employee Onboarding", category: "HR" },
  "template-5": { title: "Customer Satisfaction", category: "Customer" },
}

interface InstancesListProps {
  instances: any[]
  selectedInstanceId: string | null
  onSelectInstance: (id: string) => void
}

export function InstancesList({ instances, selectedInstanceId, onSelectInstance }: InstancesListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter instances based on search query
  const filteredInstances = instances.filter(
    (instance) =>
      instance.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instance.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get status icon based on instance status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Mail className="h-4 w-4" />
      case "opened":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Questionnaire Instances</CardTitle>
        <CardDescription>Track sent questionnaires</CardDescription>
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
                    selectedInstanceId === instance.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  onClick={() => onSelectInstance(instance.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{instance.title}</h4>
                      <p className="text-sm opacity-90">{instance.email}</p>
                    </div>
                    <ChevronRight
                      className={`h-5 w-5 ${
                        selectedInstanceId === instance.id ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <Badge
                      variant={selectedInstanceId === instance.id ? "outline" : "secondary"}
                      className={`flex items-center gap-1 ${
                        selectedInstanceId === instance.id ? "border-primary-foreground" : ""
                      }`}
                    >
                      {getStatusIcon(instance.status)}
                      <span className="capitalize">{instance.status}</span>
                    </Badge>
                    <span className="text-sm">{formatDate(instance.sentDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
