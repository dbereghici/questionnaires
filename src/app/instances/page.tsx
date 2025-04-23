"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InstanceResults } from "@/components/instances/instance-results"
import { InstanceMetrics } from "@/components/instances/instance-metrics"

export default function InstancesPage() {
  const [activeTab, setActiveTab] = useState("results")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Questionnaire Instances</h1>
        <p className="text-muted-foreground">View and analyze completed questionnaire instances</p>
      </div>

      <Tabs defaultValue="results" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="results" className="pt-6">
          <InstanceResults />
        </TabsContent>
        <TabsContent value="metrics" className="pt-6">
          <InstanceMetrics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
