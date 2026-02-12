import { useState } from 'react'
import { Box, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'

export default function Tabs({ children, ...props }) {
    
    const [value, setValue] = useState(1);

    function renderChildOrChildrenTabs(children) {

        if(Array.isArray(children)) {
            const multiChild = children.map((child, index) => {
                return <Tab label={child.props.label} value={child.props.index} key={index}/>
            })
            return multiChild
        }

        return <Tab label={children.props.label} value={children.props.index} />
    }

    function renderChildOrChildrenContent(children) {

        if(Array.isArray(children)) {
            const multiChild = children.map((child, index) => {
                return <TabPanel value={child.props.index} key={index}>{child.props.component}</TabPanel>
            })
            return multiChild
        }

        return <TabPanel value={children.props.index}>{children.props.component}</TabPanel>
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        {
                            renderChildOrChildrenTabs(children)
                        }
                    </TabList>
                </Box>
                {
                    renderChildOrChildrenContent(children)
                }
            </TabContext>
        </Box>
    )
}