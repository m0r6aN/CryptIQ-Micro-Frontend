'use client'
import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/main'
import axios from 'axios'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/features/shared/ui/dialog'
import { Button } from '@/features/shared/ui/button'
import { Label } from '@/features/shared/ui/label'
import { Input } from '@/features/shared/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Switch } from '@/features/shared/ui/switch'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/features/shared/ui/collapsible'
import { ScrollArea } from '@/features/shared/ui/scroll-area'


interface DockerService {
  uid: string;
  containerName: string;
  port: number;
  label: string;
  status: 'running' | 'stopped' | 'error';
  lastConnected: number;
  cpu: string;
  memory: string;
}

export default function DockerServiceManagement() {
  const dispatch = useAppDispatch()
  const authToken = useAppSelector((state: any) => state.auth?.auth_token)
  const [services, setServices] = useState<DockerService[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const [logs, setLogs] = useState<string>('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newService, setNewService] = useState({ containerName: '', port: '', label: '' })

  useEffect(() => {
    fetchDockerServices()
    const interval = setInterval(updateResourceUsage, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchDockerServices = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:1337/api/docker-services', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setServices(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching Docker services:', error)
      toast({
        title: "Error",
        description: "Failed to fetch Docker services. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const addDockerService = async () => {
    try {
      const response = await axios.post(
        'http://localhost:1337/api/docker-services',
        newService,
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      setServices([...services, response.data])
      setIsAddDialogOpen(false)
      setNewService({ containerName: '', port: '', label: '' })
      toast({
        title: "Success",
        description: "Docker service added successfully.",
      })
    } catch (error) {
      console.error('Error adding Docker service:', error)
      toast({
        title: "Error",
        description: "Failed to add Docker service. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeDockerService = async (serviceId: string) => {
    try {
      await axios.delete(`http://localhost:1337/api/docker-services/${serviceId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setServices(services.filter((service) => service.uid !== serviceId))
      toast({
        title: "Success",
        description: "Docker service removed successfully.",
      })
    } catch (error) {
      console.error('Error removing Docker service:', error)
      toast({
        title: "Error",
        description: "Failed to remove Docker service. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleDockerService = async (service: DockerService) => {
    try {
      const newStatus = service.status === 'running' ? 'stopped' : 'running'
      await axios.put(
        `http://localhost:1337/api/docker-services/${service.uid}`,
        { ...service, status: newStatus },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      setServices(
        services.map((s) =>
          s.uid === service.uid ? { ...s, status: newStatus } : s
        )
      )
      toast({
        title: "Success",
        description: `Docker service ${newStatus === 'running' ? 'started' : 'stopped'} successfully.`,
      })
    } catch (error) {
      console.error('Error toggling Docker service:', error)
      toast({
        title: "Error",
        description: "Failed to toggle Docker service. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchDockerServiceLogs = async (serviceId: string) => {
    try {
      const response = await axios.get(`http://localhost:1337/api/docker-services/${serviceId}/logs`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setLogs(response.data.logs)
    } catch (error) {
      console.error('Error fetching Docker service logs:', error)
      toast({
        title: "Error",
        description: "Failed to fetch Docker service logs. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleExpand = (serviceId: string) => {
    if (expandedService === serviceId) {
      setExpandedService(null)
      setLogs('')
    } else {
      setExpandedService(serviceId)
      fetchDockerServiceLogs(serviceId)
    }
  }

  const updateResourceUsage = () => {
    setServices(prevServices =>
      prevServices.map(service => ({
        ...service,
        cpu: `${Math.floor(Math.random() * 10)}%`,
        memory: `${Math.floor(Math.random() * 1024)}MB`
      }))
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Docker Service Management</h1>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Docker Service</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Docker Service</DialogTitle>
            <DialogDescription>Enter the details for the new Docker service.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="containerName" className="text-right">Container Name</Label>
              <Input
                id="containerName"
                value={newService.containerName}
                onChange={(e: { target: { value: any } }) => setNewService({ ...newService, containerName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="port" className="text-right">Port</Label>
              <Input
                id="port"
                type="number"
                value={newService.port}
                onChange={(e: { target: { value: any } }) => setNewService({ ...newService, port: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right">Label (optional)</Label>
              <Input
                id="label"
                value={newService.label}
                onChange={(e: { target: { value: any } }) => setNewService({ ...newService, label: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addDockerService}>Add Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <Card key={service.uid}>
              <CardHeader>
                <CardTitle>{service.label || service.containerName}</CardTitle>
                <CardDescription>Container ID: {service.uid}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span>Port: {service.port}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    service.status === 'running' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {service.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Switch
                    checked={service.status === 'running'}
                    onCheckedChange={() => toggleDockerService(service)}
                  />
                </div>
                <div className="mt-2">
                  <p>CPU Usage: {service.cpu}</p>
                  <p>Memory Usage: {service.memory}</p>
                </div>
              </CardContent>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="link" className="w-full">
                    {expandedService === service.uid ? 'Hide Details' : 'Show Details'}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <h4 className="font-semibold mb-2">Logs:</h4>
                    <ScrollArea className="h-[100px] w-full rounded-md border p-2">
                      <pre className="text-sm">{logs || 'No logs available'}</pre>
                    </ScrollArea>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently remove the Docker service.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => removeDockerService(service.uid)}>
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}