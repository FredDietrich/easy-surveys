import Box from "@mui/material/Box";

interface IFormItemProps {
    children: JSX.Element[] | JSX.Element,
    justifyContent?: string,
    sx?: any
}

function FormItem({children, sx, justifyContent}: IFormItemProps) {
    return (
        <Box sx={[{padding: 1, display: 'flex'}, sx]} justifyContent={justifyContent}>
            {children}
        </Box>
    )
}

export default FormItem;