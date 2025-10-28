import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SelectableQRCodeCard from '@/components/SelectableQRCodeCard'
import { QRCode } from '@/types'

// Mock the QR generator
jest.mock('@/lib/qr-generator', () => ({
  QRGenerator: {
    generateQRCode: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-image'),
  },
}))

// Mock the toast hook
jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
  }),
}))

// Mock the timezone hook
jest.mock('@/hooks/useUserTimezone', () => ({
  useUserTimezone: () => 'UTC',
}))

// Mock the date utils
jest.mock('@/lib/date-utils', () => ({
  formatTimeAgoInTimezone: () => '2 hours ago',
}))

const mockQRCode: QRCode = {
  id: 'qr1',
  name: 'Test QR Code',
  type: 'url',
  content: 'https://example.com',
  settings: {},
  isDynamic: false,
  createdAt: new Date(),
  scans: [
    {
      id: 'scan1',
      scannedAt: new Date(),
      device: 'iPhone',
      country: 'US',
    },
  ],
}

describe('SelectableQRCodeCard Component', () => {
  const mockProps = {
    qr: mockQRCode,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onShare: jest.fn(),
    isSelected: false,
    onToggleSelection: jest.fn(),
    showSelection: true,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders QR code information correctly', () => {
    render(<SelectableQRCodeCard {...mockProps} />)
    
    expect(screen.getByText('Test QR Code')).toBeInTheDocument()
    expect(screen.getByText('url QR Code')).toBeInTheDocument()
    expect(screen.getByText('Created 2 hours ago')).toBeInTheDocument()
  })

  it('shows selection checkbox when showSelection is true', () => {
    render(<SelectableQRCodeCard {...mockProps} />)
    
    const checkbox = screen.getByRole('checkbox', { hidden: true })
    expect(checkbox).toBeInTheDocument()
  })

  it('does not show selection checkbox when showSelection is false', () => {
    render(
      <SelectableQRCodeCard
        {...mockProps}
        showSelection={false}
      />
    )
    
    const checkbox = screen.queryByRole('checkbox', { hidden: true })
    expect(checkbox).not.toBeInTheDocument()
  })

  it('shows selected state when isSelected is true', () => {
    render(
      <SelectableQRCodeCard
        {...mockProps}
        isSelected={true}
      />
    )
    
    const card = screen.getByText('Test QR Code').closest('div[class*="bg-white border rounded-lg"]')
    expect(card).toHaveClass('border-blue-500')
  })

  it('shows unselected state when isSelected is false', () => {
    render(
      <SelectableQRCodeCard
        {...mockProps}
        isSelected={false}
      />
    )
    
    const card = screen.getByText('Test QR Code').closest('div[class*="bg-white border rounded-lg"]')
    expect(card).toHaveClass('border-gray-200')
  })

  it('calls onToggleSelection when card is clicked', () => {
    const onToggleSelection = jest.fn()
    render(
      <SelectableQRCodeCard
        {...mockProps}
        onToggleSelection={onToggleSelection}
      />
    )
    
    const card = screen.getByText('Test QR Code').closest('div')
    fireEvent.click(card!)
    
    expect(onToggleSelection).toHaveBeenCalled()
  })

  it('does not call onToggleSelection when clicking on buttons', () => {
    const onToggleSelection = jest.fn()
    render(
      <SelectableQRCodeCard
        {...mockProps}
        onToggleSelection={onToggleSelection}
      />
    )
    
    // Click on the actions button
    const actionsButton = screen.getByRole('button', { name: /actions/i })
    fireEvent.click(actionsButton)
    
    expect(onToggleSelection).not.toHaveBeenCalled()
  })

  it('shows actions dropdown when actions button is clicked', () => {
    render(<SelectableQRCodeCard {...mockProps} />)
    
    const actionsButton = screen.getByRole('button', { name: /actions/i })
    fireEvent.click(actionsButton)
    
    expect(screen.getByText('Preview')).toBeInTheDocument()
    expect(screen.getByText('Copy Link')).toBeInTheDocument()
    expect(screen.getByText('Download')).toBeInTheDocument()
    expect(screen.getByText('Share')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn()
    render(
      <SelectableQRCodeCard
        {...mockProps}
        onEdit={onEdit}
      />
    )
    
    // Open actions dropdown
    const actionsButton = screen.getByRole('button', { name: /actions/i })
    fireEvent.click(actionsButton)
    
    // Click edit
    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)
    
    expect(onEdit).toHaveBeenCalled()
  })

  it('shows delete confirmation modal when delete is clicked', () => {
    render(<SelectableQRCodeCard {...mockProps} />)
    
    // Open actions dropdown
    const actionsButton = screen.getByRole('button', { name: /actions/i })
    fireEvent.click(actionsButton)
    
    // Click delete
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)
    
    expect(screen.getByText('Delete QR Code')).toBeInTheDocument()
    const deleteTexts = screen.getAllByText((content, element) => {
      return element?.textContent?.includes('Are you sure you want to delete') &&
             element?.textContent?.includes('Test QR Code') &&
             element?.textContent?.includes('?')
    })
    expect(deleteTexts[0]).toBeInTheDocument()
  })

  it('calls onDelete when delete is confirmed', () => {
    const onDelete = jest.fn()
    render(
      <SelectableQRCodeCard
        {...mockProps}
        onDelete={onDelete}
      />
    )
    
    // Open actions dropdown
    const actionsButton = screen.getByRole('button', { name: /actions/i })
    fireEvent.click(actionsButton)
    
    // Click delete
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)
    
    // Confirm delete
    const confirmButton = screen.getByText('Delete')
    fireEvent.click(confirmButton)
    
    expect(onDelete).toHaveBeenCalled()
  })

  it('shows dynamic badge for dynamic QR codes', () => {
    const dynamicQR = {
      ...mockQRCode,
      isDynamic: true,
      shortUrl: 'https://short.ly/abc123',
    }
    
    render(
      <SelectableQRCodeCard
        {...mockProps}
        qr={dynamicQR}
      />
    )
    
    expect(screen.getByText('Dynamic')).toBeInTheDocument()
  })

  it('displays scan statistics', () => {
    render(<SelectableQRCodeCard {...mockProps} />)
    
    expect(screen.getAllByText('1')[0]).toBeInTheDocument() // Total scans
    expect(screen.getByText('Total Scans')).toBeInTheDocument()
    expect(screen.getByText('This Week')).toBeInTheDocument()
  })

  it('handles QR code image generation', async () => {
    render(<SelectableQRCodeCard {...mockProps} />)
    
    // Wait for QR code image to be generated
    await waitFor(() => {
      const qrImage = screen.getByAltText('QR Code for Test QR Code')
      expect(qrImage).toBeInTheDocument()
    })
  })
})
