import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import BulkOperations from '@/components/BulkOperations'
import { QRCode } from '@/types'

// Mock the toast hook
jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
    showWarning: jest.fn(),
  }),
}))

const mockQRCodes: QRCode[] = [
  {
    id: 'qr1',
    name: 'Test QR 1',
    type: 'url',
    content: 'https://example1.com',
    settings: {},
    isDynamic: false,
    createdAt: new Date(),
    scans: [],
  },
  {
    id: 'qr2',
    name: 'Test QR 2',
    type: 'text',
    content: 'Hello World',
    settings: {},
    isDynamic: false,
    createdAt: new Date(),
    scans: [],
  },
]

describe('BulkOperations Component', () => {
  const mockProps = {
    qrCodes: mockQRCodes,
    selectedIds: [],
    onSelectionChange: jest.fn(),
    onBulkDelete: jest.fn(),
    onBulkDownload: jest.fn(),
    currentPlan: 'pro',
    isTrialActive: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing for non-Pro plans', () => {
    const { container } = render(
      <BulkOperations
        {...mockProps}
        currentPlan="free"
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing for starter plans', () => {
    const { container } = render(
      <BulkOperations
        {...mockProps}
        currentPlan="starter"
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders for Pro plans', () => {
    render(<BulkOperations {...mockProps} />)
    
    expect(screen.getByText('Select all (2)')).toBeInTheDocument()
  })

  it('renders for Business plans', () => {
    render(
      <BulkOperations
        {...mockProps}
        currentPlan="business"
      />
    )
    
    expect(screen.getByText('Select all (2)')).toBeInTheDocument()
  })

  it('renders for Pro trial plans', () => {
    render(
      <BulkOperations
        {...mockProps}
        isTrialActive={true}
        currentPlan="pro"
      />
    )
    
    expect(screen.getByText('Select all (2)')).toBeInTheDocument()
  })

  it('shows bulk operations bar when QR codes are selected', () => {
    render(
      <BulkOperations
        {...mockProps}
        selectedIds={['qr1']}
      />
    )
    
    expect(screen.getByText('1 QR code selected')).toBeInTheDocument()
    expect(screen.getByText('Clear selection')).toBeInTheDocument()
    expect(screen.getByText('Download')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('handles select all functionality', () => {
    const onSelectionChange = jest.fn()
    render(
      <BulkOperations
        {...mockProps}
        onSelectionChange={onSelectionChange}
      />
    )
    
    const selectAllCheckbox = screen.getByRole('checkbox')
    fireEvent.click(selectAllCheckbox)
    
    expect(onSelectionChange).toHaveBeenCalledWith(['qr1', 'qr2'])
  })

  it('handles clear selection', () => {
    const onSelectionChange = jest.fn()
    render(
      <BulkOperations
        {...mockProps}
        selectedIds={['qr1']}
        onSelectionChange={onSelectionChange}
      />
    )
    
    const clearButton = screen.getByText('Clear selection')
    fireEvent.click(clearButton)
    
    expect(onSelectionChange).toHaveBeenCalledWith([])
  })

  it('handles bulk download', async () => {
    const onBulkDownload = jest.fn().mockResolvedValue(undefined)
    render(
      <BulkOperations
        {...mockProps}
        selectedIds={['qr1', 'qr2']}
        onBulkDownload={onBulkDownload}
      />
    )
    
    const downloadButton = screen.getByText('Download')
    fireEvent.click(downloadButton)
    
    await waitFor(() => {
      expect(onBulkDownload).toHaveBeenCalledWith(['qr1', 'qr2'])
    })
  })

  it('shows delete confirmation modal', () => {
    render(
      <BulkOperations
        {...mockProps}
        selectedIds={['qr1', 'qr2']}
      />
    )
    
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)
    
    expect(screen.getByText('Delete QR Codes')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()
  })

  it('handles bulk delete confirmation', async () => {
    const onBulkDelete = jest.fn().mockResolvedValue(undefined)
    render(
      <BulkOperations
        {...mockProps}
        selectedIds={['qr1', 'qr2']}
        onBulkDelete={onBulkDelete}
      />
    )
    
    // Open delete confirmation
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)
    
    // Confirm delete - get the second Delete button (in the modal)
    const deleteButtons = screen.getAllByText('Delete')
    const confirmButton = deleteButtons[1] // Second Delete button is in the modal
    fireEvent.click(confirmButton)
    
    await waitFor(() => {
      expect(onBulkDelete).toHaveBeenCalledWith(['qr1', 'qr2'])
    })
  })

  it('handles bulk delete cancellation', () => {
    const onBulkDelete = jest.fn()
    render(
      <BulkOperations
        {...mockProps}
        selectedIds={['qr1', 'qr2']}
        onBulkDelete={onBulkDelete}
      />
    )
    
    // Open delete confirmation
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)
    
    // Cancel delete
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    expect(onBulkDelete).not.toHaveBeenCalled()
  })

  it('shows processing state during operations', async () => {
    const onBulkDownload = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(
      <BulkOperations
        {...mockProps}
        selectedIds={['qr1']}
        onBulkDownload={onBulkDownload}
      />
    )
    
    const downloadButton = screen.getByText('Download')
    fireEvent.click(downloadButton)
    
    // Should show loading state - the button should be disabled and show spinner
    const downloadButtonElement = screen.getByRole('button', { name: 'Download' })
    expect(downloadButtonElement).toBeDisabled()
    
    await waitFor(() => {
      expect(downloadButtonElement).not.toBeDisabled()
    })
  })
})
