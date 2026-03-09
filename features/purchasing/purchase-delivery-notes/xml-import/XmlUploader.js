import { useState, useRef } from 'react'
import { Box, Button, CircularProgress, Typography, Paper } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

export default function XmlUploader({ onFileSelect, isLoading = false, disabled = false }) {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef(null)

    function handleButtonClick() {
        fileInputRef.current?.click()
    }

    function handleFileChange(event) {
        const file = event.target.files?.[0]
        if (file) {
            onFileSelect(file)
        }
        event.target.value = ''
    }

    function handleDragOver(event) {
        event.preventDefault()
        event.stopPropagation()
        if (!disabled && !isLoading) {
            setIsDragging(true)
        }
    }

    function handleDragLeave(event) {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)
    }

    function handleDrop(event) {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)

        if (disabled || isLoading) return

        const file = event.dataTransfer.files?.[0]
        if (file && file.name.toLowerCase().endsWith('.xml')) {
            onFileSelect(file)
        }
    }

    return (
        <Box>
            <input
                type="file"
                accept=".xml"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            <Paper
                variant="outlined"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: isDragging ? 'action.hover' : 'background.paper',
                    borderStyle: 'dashed',
                    borderColor: isDragging ? 'primary.main' : 'divider',
                    borderWidth: 2,
                    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        borderColor: disabled || isLoading ? 'divider' : 'primary.main',
                        backgroundColor: disabled || isLoading ? 'background.paper' : 'action.hover'
                    }
                }}
                onClick={!disabled && !isLoading ? handleButtonClick : undefined}
            >
                {isLoading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={48} />
                        <Typography variant="body1" color="text.secondary">
                            Processando XML...
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                        <Typography variant="h6" color="text.primary">
                            Arraste o arquivo XML aqui
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            ou clique para selecionar
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<UploadFileIcon />}
                            disabled={disabled}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleButtonClick()
                            }}
                        >
                            SELECIONAR XML
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    )
}
