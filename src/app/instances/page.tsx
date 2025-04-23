"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InstancesList } from "@/components/instances/instances-list"
import { InstanceDetails } from "@/components/instances/instance-details"

export default function InstancesPage() {
  const [instances, setInstances] = useState<any[]>([])
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Load sent questionnaires from localStorage
  useEffect(() => {
    const storedInstances = localStorage.getItem("sent_questionnaires")
    if (storedInstances) {
      try {
        const parsedInstances = JSON.parse(storedInstances)
        setInstances(parsedInstances)
      } catch (error) {
        console.error("Error loading instances:", error)
      }
    }
  }, [])

  // Filter instances based on active tab
  const filteredInstances = instances.filter((instance) => {
    if (activeTab === "all") return true
    return instance.status === activeTab
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Questionnaire Instances</h1>
        <p className="text-muted-foreground">Track and manage sent questionnaires</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="opened">Opened</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <InstancesList
              instances={filteredInstances}
              selectedInstanceId={selectedInstanceId}
              onSelectInstance={setSelectedInstanceId}
            />
          </div>
          <div className="md:col-span-2">
            <InstanceDetails
              instanceId={selectedInstanceId}
              instances={instances}
              onUpdateInstance={(updatedInstance) => {
                const updatedInstances = instances.map((inst) =>
                  inst.id === updatedInstance.id ? updatedInstance : inst,
                )
                setInstances(updatedInstances)
                localStorage.setItem("sent_questionnaires", JSON.stringify(updatedInstances))
              }}
            />
          </div>
        </div>
      </Tabs>
    </div>
  )
}
