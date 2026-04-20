'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Employee {
  id: string
  name: string
  empId: string
  department: string
  role: string
  salary: number
  joiningDate: string
  status: 'active' | 'inactive'
  terminationDate?: string
  terminationReason?: string
}

interface PayrollRecord {
  empId: string
  name: string
  grossSalary: number
  deductions: number
  netSalary: number
  month: string
}

export default function H2RDashboard() {
  const [currentTab, setCurrentTab] = useState('dashboard')
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Smith',
      empId: 'EMP001',
      department: 'Engineering',
      role: 'Senior Developer',
      salary: 120000,
      joiningDate: '2021-03-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      empId: 'EMP002',
      department: 'HR',
      role: 'HR Manager',
      salary: 95000,
      joiningDate: '2020-06-01',
      status: 'active'
    },
    {
      id: '3',
      name: 'Michael Chen',
      empId: 'EMP003',
      department: 'Finance',
      role: 'Finance Analyst',
      salary: 85000,
      joiningDate: '2022-01-10',
      status: 'active'
    }
  ])

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([])
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    empId: '',
    department: '',
    role: '',
    salary: '',
    joiningDate: ''
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const addEmployee = () => {
    if (!newEmployee.name || !newEmployee.empId || !newEmployee.department || !newEmployee.role || !newEmployee.salary || !newEmployee.joiningDate) {
      showToast('Please fill all fields')
      return
    }

    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      empId: newEmployee.empId,
      department: newEmployee.department,
      role: newEmployee.role,
      salary: parseFloat(newEmployee.salary),
      joiningDate: newEmployee.joiningDate,
      status: 'active'
    }

    setEmployees([...employees, employee])
    setNewEmployee({
      name: '',
      empId: '',
      department: '',
      role: '',
      salary: '',
      joiningDate: ''
    })
    showToast(`Employee ${employee.name} added successfully!`)
  }

  const deleteEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id)
    setEmployees(employees.filter(e => e.id !== id))
    showToast(`Employee ${emp?.name} deleted`)
  }

  const runPayroll = () => {
    const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    const records = employees
      .filter(emp => emp.status === 'active')
      .map(emp => ({
        empId: emp.empId,
        name: emp.name,
        grossSalary: emp.salary,
        deductions: Math.round(emp.salary * 0.15),
        netSalary: Math.round(emp.salary * 0.85),
        month
      }))
    
    setPayrollRecords(records)
    showToast(`Payroll processed for ${records.length} employees`)
  }

  const terminateEmployee = (id: string, lastWorkingDay: string, reason: string) => {
    const updated = employees.map(emp => 
      emp.id === id 
        ? { ...emp, status: 'inactive', terminationDate: lastWorkingDay, terminationReason: reason }
        : emp
    )
    setEmployees(updated)
    const emp = employees.find(e => e.id === id)
    showToast(`Employee ${emp?.name} terminated successfully`)
  }

  const activeEmployees = employees.filter(emp => emp.status === 'active').length
  const totalEmployees = employees.length
  const inactiveEmployees = employees.filter(emp => emp.status === 'inactive').length
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.empId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">H2R System</h1>
          <p className="text-sm text-gray-400">Employee Lifecycle</p>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '[DB]' },
            { id: 'employees', label: 'Employees', icon: '[EM]' },
            { id: 'payroll', label: 'Payroll', icon: '[PY]' },
            { id: 'offboarding', label: 'Offboarding', icon: '[OF]' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                currentTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-slate-800'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
              {toastMessage}
            </div>
          )}

          {/* Dashboard Tab */}
          {currentTab === 'dashboard' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
                <p className="text-gray-600">Overview of your HR operations</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalEmployees}</div>
                    <p className="text-xs text-gray-500 mt-1">All registered employees</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Employees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{activeEmployees}</div>
                    <p className="text-xs text-gray-500 mt-1">Currently working</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Payroll Processed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{payrollRecords.length > 0 ? activeEmployees : 0}</div>
                    <p className="text-xs text-gray-500 mt-1">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Pending Offboarding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">{inactiveEmployees}</div>
                    <p className="text-xs text-gray-500 mt-1">Terminated employees</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks in the H2R lifecycle</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4 flex-wrap">
                  <Button onClick={() => setCurrentTab('employees')} variant="outline">
                    Add Employee
                  </Button>
                  <Button onClick={() => setCurrentTab('payroll')} variant="outline">
                    Run Payroll
                  </Button>
                  <Button onClick={() => setCurrentTab('offboarding')} variant="outline">
                    Offboard Employee
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Employees Tab */}
          {currentTab === 'employees' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Employee Management</h2>
                <p className="text-gray-600">Manage your workforce</p>
              </div>

              {/* Add Employee Form */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Add New Employee</CardTitle>
                  <CardDescription>Fill in the details to add a new employee to the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="empId">Employee ID</Label>
                      <Input
                        id="empId"
                        placeholder="EMP001"
                        value={newEmployee.empId}
                        onChange={(e) => setNewEmployee({...newEmployee, empId: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        placeholder="Engineering"
                        value={newEmployee.department}
                        onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        placeholder="Senior Developer"
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary">Salary</Label>
                      <Input
                        id="salary"
                        placeholder="120000"
                        type="number"
                        value={newEmployee.salary}
                        onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="joiningDate">Joining Date</Label>
                      <Input
                        id="joiningDate"
                        type="date"
                        value={newEmployee.joiningDate}
                        onChange={(e) => setNewEmployee({...newEmployee, joiningDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={addEmployee} className="w-full">Add Employee</Button>
                </CardContent>
              </Card>

              {/* Search and Filter */}
              <div className="mb-6">
                <Input
                  placeholder="Search by name or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Employees Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Employee List</CardTitle>
                  <CardDescription>All employees in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Salary</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployees.map(emp => (
                          <TableRow key={emp.id}>
                            <TableCell className="font-medium">{emp.name}</TableCell>
                            <TableCell>{emp.empId}</TableCell>
                            <TableCell>{emp.department}</TableCell>
                            <TableCell>{emp.role}</TableCell>
                            <TableCell>${emp.salary.toLocaleString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                emp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {emp.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteEmployee(emp.id)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payroll Tab */}
          {currentTab === 'payroll' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Payroll Management</h2>
                <p className="text-gray-600">Process and manage employee payroll</p>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Run Payroll</CardTitle>
                  <CardDescription>Process salary calculations for all active employees</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={runPayroll} className="w-full" size="lg">
                    Process Payroll
                  </Button>
                </CardContent>
              </Card>

              {payrollRecords.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payroll Records</CardTitle>
                    <CardDescription>{payrollRecords[0]?.month || 'Current'} - {payrollRecords.length} employees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Gross Salary</TableHead>
                            <TableHead>Deductions (15%)</TableHead>
                            <TableHead>Net Salary</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payrollRecords.map(record => (
                            <TableRow key={record.empId}>
                              <TableCell className="font-medium">{record.empId}</TableCell>
                              <TableCell>{record.name}</TableCell>
                              <TableCell>${record.grossSalary.toLocaleString()}</TableCell>
                              <TableCell>${record.deductions.toLocaleString()}</TableCell>
                              <TableCell className="font-semibold text-green-600">${record.netSalary.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Offboarding Tab */}
          {currentTab === 'offboarding' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Employee Offboarding</h2>
                <p className="text-gray-600">Manage employee termination and exit</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Terminate Employee</CardTitle>
                  <CardDescription>Mark an employee as terminated (PA40)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employees.filter(emp => emp.status === 'active').map(emp => (
                      <OffboardingCard
                        key={emp.id}
                        employee={emp}
                        onTerminate={terminateEmployee}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {inactiveEmployees > 0 && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Terminated Employees</CardTitle>
                    <CardDescription>{inactiveEmployees} employees have been terminated</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Employee ID</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Last Working Day</TableHead>
                            <TableHead>Reason</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {employees.filter(emp => emp.status === 'inactive').map(emp => (
                            <TableRow key={emp.id}>
                              <TableCell className="font-medium">{emp.name}</TableCell>
                              <TableCell>{emp.empId}</TableCell>
                              <TableCell>{emp.department}</TableCell>
                              <TableCell>{emp.terminationDate || 'N/A'}</TableCell>
                              <TableCell>{emp.terminationReason || 'N/A'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function OffboardingCard({
  employee,
  onTerminate
}: {
  employee: Employee
  onTerminate: (id: string, lastWorkingDay: string, reason: string) => void
}) {
  const [lastWorkingDay, setLastWorkingDay] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    if (!lastWorkingDay || !reason) {
      alert('Please fill all fields')
      return
    }
    onTerminate(employee.id, lastWorkingDay, reason)
    setLastWorkingDay('')
    setReason('')
  }

  return (
    <div className="border rounded-lg p-4 flex items-center justify-between bg-gray-50">
      <div>
        <h4 className="font-semibold">{employee.name}</h4>
        <p className="text-sm text-gray-600">{employee.empId} - {employee.department}</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            Terminate
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminate Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to terminate {employee.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lastWorkingDay">Last Working Day</Label>
              <Input
                id="lastWorkingDay"
                type="date"
                value={lastWorkingDay}
                onChange={(e) => setLastWorkingDay(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason for Termination</Label>
              <Input
                id="reason"
                placeholder="e.g., Resignation, Retirement, Layoff"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <Button onClick={handleSubmit} className="w-full" variant="destructive">
              Confirm Termination
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
