import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileQuestion, ClipboardList, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Questionnaire System</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-2xl font-bold">Questionnaires</CardTitle>
            <FileQuestion className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Create and manage questionnaire templates for your organization.
            </CardDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Total Templates</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Recently Updated</span>
                <span className="font-medium">2 days ago</span>
              </div>
            </div>
            <Button asChild className="w-full mt-6">
              <Link href="/questionnaires">
                Manage Questionnaires <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-2xl font-bold">Instances</CardTitle>
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              View and analyze completed questionnaire instances and results.
            </CardDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Completed Instances</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Compliance Rate</span>
                <span className="font-medium">75%</span>
              </div>
            </div>
            <Button asChild className="w-full mt-6">
              <Link href="/instances">
                View Instances <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent questionnaire activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Security Assessment</p>
                <p className="text-sm text-muted-foreground">Instance completed</p>
              </div>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">GDPR Compliance</p>
                <p className="text-sm text-muted-foreground">Template updated</p>
              </div>
              <p className="text-sm text-muted-foreground">Yesterday</p>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">IT Infrastructure</p>
                <p className="text-sm text-muted-foreground">New instance created</p>
              </div>
              <p className="text-sm text-muted-foreground">3 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
