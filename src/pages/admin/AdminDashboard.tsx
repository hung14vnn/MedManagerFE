import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Search, Activity, FileText, PlusCircle } from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    { title: 'Manage Drugs', description: 'Add, edit, and delete drug information', icon: Search, link: '/admin/drugs', color: 'blue' },
    { title: 'Manage Interactions', description: 'Create and update drug interaction data', icon: Activity, link: '/admin/interactions', color: 'orange' },
    { title: 'Manage Diseases', description: 'Configure treatment protocols for conditions', icon: FileText, link: '/admin/diseases', color: 'green' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage drugs, interactions, and disease treatment protocols
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const bgColor = stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                          stat.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600';
          
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-lg ${bgColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{stat.title}</CardTitle>
                  <CardDescription>{stat.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-primary">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Manage {stat.title.split(' ')[1]}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              to="/admin/drugs"
              className="rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <p className="font-medium">Add New Drug</p>
              <p className="text-sm text-muted-foreground">Create a new drug entry</p>
            </Link>
            <Link
              to="/admin/interactions"
              className="rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <p className="font-medium">Add Interaction</p>
              <p className="text-sm text-muted-foreground">Record a drug-drug interaction</p>
            </Link>
            <Link
              to="/admin/diseases"
              className="rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <p className="font-medium">Add Disease Protocol</p>
              <p className="text-sm text-muted-foreground">Create treatment protocol</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
