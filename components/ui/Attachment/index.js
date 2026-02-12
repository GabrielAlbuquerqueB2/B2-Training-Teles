import { useState } from 'react'
import { Button, Collapse, Table, TableHead, TableBody, TableRow, TableCell, IconButton, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AttachFileIcon from '@mui/icons-material/AttachFile'

export default function Attachment(props) {

    function handleDeleteFile(event) {

        const index = event.currentTarget.dataset.key;
        const newItems = [...props.fileList];
        newItems.splice(index, 1);
        props.setFileList(newItems);
    }


    function handleFileAdd(file) {

        if (file) {
            const tempFiles = [...props.fileList, file];
            props.setFileList(tempFiles);
        }
    }

    return (
        <>

            <Button
                variant="contained"
                component="label"
                color='primary'
                startIcon={<AttachFileIcon />}
            >
                Selecionar arquivo
                <input
                    type="file"
                    hidden
                    onChange={(event) => {
                        handleFileAdd(event.target.files[0]);
                    }}
                />
            </Button>
            <br />
            <br />
            <Table size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Arquivo</TableCell>
                        <TableCell>Excluir</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.fileList.map((file, index) => {
                        return (
                            <TableRow
                                key={index}
                            >
                                <TableCell width="95%" sx={{ padding: '3px' }}>
                                    <TextField
                                        value={file ? file.name : ''}
                                        disabled
                                        onDoubleClick={evt => {
                                            props.getFile(index)
                                        }}
                                    />
                                </TableCell>
                                <TableCell width="5%" sx={{ padding: '3px' }}>
                                    <Button
                                        variant='outlined'
                                        onClick={handleDeleteFile}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

        </>
    );
}