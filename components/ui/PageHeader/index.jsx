import { Typography, Divider } from '@mui/material'
import styles from './PageHeader.module.css'

export default function PageHeader(props) {

    return (
        <>
            <Typography variant="h5" className={styles.title}>{props.title}</Typography>
            <Divider className={styles.divider}/>
            <br />
        </>
    )
}