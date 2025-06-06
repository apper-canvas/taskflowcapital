import React, { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import invoiceService from '@/services/api/invoiceService'

export default function FinancialReports() {
  const [summary, setSummary] = useState(null)
  const [revenueData, setRevenueData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    loadReportsData()
  }, [selectedYear])

  const loadReportsData = async () => {
    try {
      setLoading(true)
      const [summaryData, monthlyRevenue] = await Promise.all([
        invoiceService.getFinancialSummary(),
        invoiceService.getRevenueByMonth(selectedYear)
      ])
      
      setSummary(summaryData)
      setRevenueData(monthlyRevenue)
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const revenueChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#6366f1'],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1
      }
    },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ]
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value)
      }
    },
    tooltip: {
      y: {
        formatter: (value) => formatCurrency(value)
      }
    }
  }

  const revenueChartSeries = [{
    name: 'Revenue',
    data: revenueData
  }]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="Loader2" className="animate-spin" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-surface-600 dark:text-surface-400">Total Revenue</Text>
              <Text className="text-2xl font-bold text-success">
                {formatCurrency(summary?.totalRevenue || 0)}
              </Text>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" className="text-success" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-surface-600 dark:text-surface-400">Pending</Text>
              <Text className="text-2xl font-bold text-warning">
                {formatCurrency(summary?.pendingAmount || 0)}
              </Text>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" className="text-warning" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-surface-600 dark:text-surface-400">Overdue</Text>
              <Text className="text-2xl font-bold text-danger">
                {formatCurrency(summary?.overdueAmount || 0)}
              </Text>
            </div>
            <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" className="text-danger" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-surface-600 dark:text-surface-400">Total Invoices</Text>
              <Text className="text-2xl font-bold text-primary">
                {summary?.totalInvoices || 0}
              </Text>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" className="text-primary" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Text className="text-lg font-semibold text-surface-900 dark:text-white">
            Monthly Revenue
          </Text>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setSelectedYear(selectedYear - 1)}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Text className="px-4 py-2 bg-surface-100 dark:bg-surface-700 rounded-lg font-medium">
              {selectedYear}
            </Text>
            <Button
              onClick={() => setSelectedYear(selectedYear + 1)}
              disabled={selectedYear >= new Date().getFullYear()}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg disabled:opacity-50"
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>

        <Chart
          options={revenueChartOptions}
          series={revenueChartSeries}
          type="area"
          height={350}
        />
      </Card>

      {/* Invoice Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <Text className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
            Invoice Status Summary
          </Text>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <Text>Paid Invoices</Text>
              </div>
              <Text className="font-semibold">{summary?.paidInvoices || 0}</Text>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <Text>Pending Invoices</Text>
              </div>
              <Text className="font-semibold">{summary?.pendingInvoices || 0}</Text>
            </div>
            <div className="flex items-center justify-between p-3 bg-danger/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-danger rounded-full"></div>
                <Text>Overdue Invoices</Text>
              </div>
              <Text className="font-semibold">{summary?.overdueInvoices || 0}</Text>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <Text className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
            Quick Actions
          </Text>
          <div className="space-y-3">
            <Button
              onClick={() => invoiceService.markOverdue()}
              className="w-full p-3 text-left bg-warning/10 hover:bg-warning/20 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon name="AlertTriangle" className="text-warning" size={20} />
                <div>
                  <Text className="font-medium">Mark Overdue Invoices</Text>
                  <Text className="text-sm text-surface-600 dark:text-surface-400">
                    Update status for past due invoices
                  </Text>
                </div>
              </div>
            </Button>
            
            <Button className="w-full p-3 text-left bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Icon name="Download" className="text-primary" size={20} />
                <div>
                  <Text className="font-medium">Export Reports</Text>
                  <Text className="text-sm text-surface-600 dark:text-surface-400">
                    Download financial data as CSV
                  </Text>
                </div>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}