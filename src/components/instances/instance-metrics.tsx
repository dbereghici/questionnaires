
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertTriangle, LineChart } from "lucide-react"

// Mock data for metrics
const mockMetrics = {
  overall: {
    totalInstances: 24,
    compliantCount: 18,
    nonCompliantCount: 6,
    averageScore: 76,
    completedThisMonth: 8,
    completedLastMonth: 6,
    improvementRate: 12,
  },
  templates: [
    {
      name: "Security Assessment",
      instances: 10,
      averageScore: 81,
      compliantRate: 80,
    },
    {
      name: "GDPR Compliance",
      instances: 8,
      averageScore: 72,
      compliantRate: 75,
    },
    {
      name: "IT Infrastructure",
      instances: 6,
      averageScore: 78,
      compliantRate: 83,
    },
  ],
  topIssues: [
    {
      issue: "Multi-factor authentication not fully implemented",
      occurrences: 7,
      severity: "High",
    },
    {
      issue: "Data retention policies not consistently applied",
      occurrences: 6,
      severity: "Medium",
    },
    {
      issue: "Access reviews not performed regularly",
      occurrences: 5,
      severity: "High",
    },
    {
      issue: "Backup verification not documented",
      occurrences: 4,
      severity: "Medium",
    },
    {
      issue: "Incident response plan not tested",
      occurrences: 4,
      severity: "High",
    },
  ],
}

export function InstanceMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockMetrics.overall.totalInstances}</div>
            <p className="text-xs text-muted-foreground mt-1">+{mockMetrics.overall.completedThisMonth} this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((mockMetrics.overall.compliantCount / mockMetrics.overall.totalInstances) * 100)}%
            </div>
            <Progress
              value={(mockMetrics.overall.compliantCount / mockMetrics.overall.totalInstances) * 100}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{mockMetrics.overall.compliantCount} Compliant</span>
              <span>{mockMetrics.overall.nonCompliantCount} Non-Compliant</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockMetrics.overall.averageScore}/100</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">↑ {mockMetrics.overall.improvementRate}%</span> improvement from last
              month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">By Template</TabsTrigger>
          <TabsTrigger value="issues">Top Issues</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Trend</CardTitle>
              <CardDescription>Monthly compliance rate over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-80">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <LineChart className="h-16 w-16 mb-2" />
                <p>Compliance trend chart would appear here</p>
                <p className="text-sm">Jan: 65% → Jun: 75%</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="templates" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Template</CardTitle>
              <CardDescription>Compliance rates and scores by questionnaire template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockMetrics.templates.map((template) => (
                  <div key={template.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant={template.compliantRate >= 75 ? "default" : "destructive"}>
                        {template.compliantRate}% Compliant
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={template.averageScore} className="flex-1" />
                      <span className="text-sm font-medium w-12">{template.averageScore}/100</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Based on {template.instances} completed instances</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="issues" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Issues</CardTitle>
              <CardDescription>Most common compliance issues identified</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMetrics.topIssues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    {issue.severity === "High" ? (
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="font-medium">{issue.issue}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{issue.severity} Severity</Badge>
                        <span className="text-sm text-muted-foreground">Found in {issue.occurrences} instances</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Suggested Actions</CardTitle>
          <CardDescription>Recommended actions to improve compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Implement multi-factor authentication</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Deploy MFA for all critical systems to address the most common security gap identified in assessments.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Review and update data retention policies</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ensure data retention policies are consistently applied across all departments and systems.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Schedule regular access reviews</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Implement quarterly access reviews for all systems containing sensitive data.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
