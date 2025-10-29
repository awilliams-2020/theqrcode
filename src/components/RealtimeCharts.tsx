'use client'

import { useState, useEffect, useMemo } from 'react'
import { Globe, Smartphone, Monitor, Tablet, Activity } from 'lucide-react'
import { RealtimeScanData } from '@/hooks/useRealtimePolling'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

interface RealtimeChartsProps {
  scans: RealtimeScanData[]
  className?: string
}

export default function RealtimeCharts({ scans, className = '' }: RealtimeChartsProps) {
  const [chartData, setChartData] = useState({
    hourly: Array.from({ length: 24 }, (_, i) => ({ 
      hour: i, 
      count: 0, 
      time: `${i.toString().padStart(2, '0')}:00`,
      isCurrentHour: false
    })),
    daily: Array.from({ length: 7 }, (_, i) => ({ 
      day: i, 
      count: 0,
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]
    })),
    devices: [] as Array<{ name: string; value: number; color: string; icon: any }>,
    countries: [] as Array<{ name: string; value: number; flag: string }>
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Process chart data with useMemo to prevent unnecessary recalculations
  // MUST be called before any conditional returns to follow Rules of Hooks
  const processedChartData = useMemo(() => {
    if (scans.length === 0) {
      return {
        hourly: Array.from({ length: 24 }, (_, i) => ({ 
          hour: i, 
          count: 0, 
          time: `${i.toString().padStart(2, '0')}:00`,
          isCurrentHour: false
        })),
        daily: Array.from({ length: 7 }, (_, i) => ({ 
          day: i, 
          count: 0,
          dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]
        })),
        devices: [],
        countries: []
      }
    }

    // Only calculate current hour on client side to avoid SSR mismatch
    const currentHour = isMounted ? new Date().getHours() : 0

    // Calculate hourly distribution (last 24 hours)
    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const count = scans.filter(scan => {
        try {
          // Handle both Date objects and string timestamps
          const scanDate = scan.timestamp instanceof Date 
            ? scan.timestamp 
            : new Date(scan.timestamp)
          
          if (isNaN(scanDate.getTime())) {
            return false
          }
          
          // Get the local hour from the scan timestamp
          const scanHour = scanDate.getHours()
          return scanHour === i
        } catch (error) {
          return false
        }
      }).length
      return { 
        hour: i, 
        count, 
        time: `${i.toString().padStart(2, '0')}:00`,
        isCurrentHour: i === currentHour
      }
    })

    // Calculate daily distribution (last 7 days)
    const dailyData = Array.from({ length: 7 }, (_, i) => {
      const count = scans.filter(scan => {
        try {
          const scanDate = new Date(scan.timestamp)
          if (isNaN(scanDate.getTime())) {
            return false
          }
          const scanDay = scanDate.getDay()
          return scanDay === i
        } catch (error) {
          console.error('Error processing timestamp for daily data:', scan.timestamp, error)
          return false
        }
      }).length
      return { 
        day: i, 
        count,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]
      }
    })

    // Calculate device distribution with colors and icons
    const deviceData = scans.reduce((acc, scan) => {
      const device = scan.device.type.toLowerCase()
      acc[device] = (acc[device] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const deviceColors = {
      mobile: '#3b82f6',
      desktop: '#10b981', 
      tablet: '#8b5cf6',
      unknown: '#6b7280'
    }

    const deviceIcons = {
      mobile: Smartphone,
      desktop: Monitor,
      tablet: Tablet,
      unknown: Globe
    }

    const devicesArray = Object.entries(deviceData).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: deviceColors[name as keyof typeof deviceColors] || deviceColors.unknown,
      icon: deviceIcons[name as keyof typeof deviceIcons] || deviceIcons.unknown
    }))

    // Calculate country distribution with flags
    const countryData = scans.reduce((acc, scan) => {
      const country = scan.location.country
      acc[country] = (acc[country] || 0) + 1
      return acc
    }, {} as Record<string, number>)
                
    const countryFlags: Record<string, string> = {
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧', 
      'Canada': '🇨🇦',
      'Germany': '🇩🇪',
      'Australia': '🇦🇺',
      'France': '🇫🇷',
      'Japan': '🇯🇵',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Netherlands': '🇳🇱',
      'Sweden': '🇸🇪',
      'Norway': '🇳🇴',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'Belgium': '🇧🇪',
      'Poland': '🇵🇱',
      'Russia': '🇷🇺',
      'South Korea': '🇰🇷',
      'Singapore': '🇸🇬',
      'Hong Kong': '🇭🇰',
      'Mexico': '🇲🇽',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'South Africa': '🇿🇦',
      'Nigeria': '🇳🇬',
      'Egypt': '🇪🇬',
      'Turkey': '🇹🇷',
      'Israel': '🇮🇱',
      'United Arab Emirates': '🇦🇪',
      'Saudi Arabia': '🇸🇦',
      'Thailand': '🇹🇭',
      'Malaysia': '🇲🇾',
      'Indonesia': '🇮🇩',
      'Philippines': '🇵🇭',
      'Vietnam': '🇻🇳',
      'New Zealand': '🇳🇿'
    }

    const countriesArray = Object.entries(countryData)
      .map(([name, value]) => ({
        name,
        value,
        flag: countryFlags[name] || '🌍'
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8) // Top 8 countries

    return {
      hourly: hourlyData,
      daily: dailyData,
      devices: devicesArray,
      countries: countriesArray
    }
  }, [scans, isMounted])

  // Update chart data when processed data changes
  useEffect(() => {
    setChartData(processedChartData)
  }, [processedChartData])

  // Chart.js configurations
  const hourlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const count = context.parsed.y
            const time = context.label
            return `${time}: ${count} scan${count !== 1 ? 's' : ''}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      },
      x: {
        ticks: {
          maxTicksLimit: 12
        }
      }
    }
  }

  const deviceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed} scan${context.parsed !== 1 ? 's' : ''}`
          }
        }
      }
    }
  }

  const countryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const country = chartData.countries[context.dataIndex]
            return `${country.flag} ${context.label}: ${context.parsed.x} scan${context.parsed.x !== 1 ? 's' : ''}`
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }

  // Prepare Chart.js data
  const hourlyChartData = {
    labels: chartData.hourly.map(h => h.time),
    datasets: [
      {
        data: chartData.hourly.map(h => h.count), // Just the count values, not objects
        backgroundColor: chartData.hourly.map(h => 
          h.isCurrentHour ? '#10b981' : '#3b82f6'
        ),
        borderColor: chartData.hourly.map(h => 
          h.isCurrentHour ? '#059669' : '#2563eb'
        ),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  }

  const deviceChartData = {
    labels: chartData.devices.map(d => d.name),
    datasets: [
      {
        data: chartData.devices.map(d => d.value),
        backgroundColor: chartData.devices.map(d => d.color),
        borderWidth: 0,
      }
    ]
  }

  const countryChartData = {
    labels: chartData.countries.map(c => c.name),
    datasets: [
      {
        data: chartData.countries.map(c => c.value),
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  }

  if (scans.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Charts</h3>
          <p className="text-gray-600 mb-4">
            Charts will update in real-time as scans come in
          </p>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
            Waiting for data...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Live Hourly Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Live Scan Activity (24h)</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">LIVE</span>
          </div>
        </div>
        
        <div className="h-64 sm:h-80">
          <Bar data={hourlyChartData} options={hourlyChartOptions} />
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 space-y-2 sm:space-y-0">
          <span>Last 24 hours • Hourly distribution</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs">Previous hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded animate-pulse"></div>
              <span className="text-xs">Current hour</span>
            </div>
          </div>
        </div>
      </div>

      {/* Device Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Device Distribution</h3>
          </div>
          
          {chartData.devices.length > 0 ? (
            <div className="h-64">
              <Pie data={deviceChartData} options={deviceChartOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Smartphone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No device data yet</p>
              </div>
            </div>
          )}
          
          {/* Device Legend */}
          {chartData.devices.length > 0 && (
            <div className="mt-4 space-y-2">
              {chartData.devices.map((device) => {
                const total = chartData.devices.reduce((sum, d) => sum + d.value, 0)
                const percentage = total > 0 ? ((device.value / total) * 100).toFixed(1) : 0
                const Icon = device.icon
                
                return (
                  <div key={device.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: device.color }}
                      ></div>
                      <Icon className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-900">{device.name}</span>
                    </div>
                    <span className="text-gray-600 font-medium">
                      {device.value} ({percentage}%)
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Country Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Countries</h3>
          </div>
          
          {chartData.countries.length > 0 ? (
            <div className="h-64">
              <Bar
                data={countryChartData} 
                options={{
                  ...countryChartOptions,
                  indexAxis: 'y' as const
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Globe className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No geographic data yet</p>
              </div>
            </div>
          )}
          
          {/* Country List */}
          {chartData.countries.length > 0 && (
            <div className="mt-4 space-y-2">
              {chartData.countries.slice(0, 4).map((country) => {
                const total = chartData.countries.reduce((sum, c) => sum + c.value, 0)
                const percentage = total > 0 ? ((country.value / total) * 100).toFixed(1) : 0
                
                return (
                  <div key={country.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{country.flag}</span>
                      <span className="text-gray-900 truncate">{country.name}</span>
                    </div>
                    <span className="text-gray-600 font-medium">
                      {country.value} ({percentage}%)
                    </span>
                  </div>
                )
              })}
          </div>
          )}
        </div>
      </div>

      {/* Live Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-900">{scans.length}</div>
            <div className="text-sm text-blue-600">Total Scans</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-900">
              {new Set(scans.map(s => s.location.country)).size}
            </div>
            <div className="text-sm text-green-600">Countries</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-900">
              {new Set(scans.map(s => s.device.type)).size}
            </div>
            <div className="text-sm text-purple-600">Device Types</div>
          </div>
        </div>
      </div>
    </div>
  )
}