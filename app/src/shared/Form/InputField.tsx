import { TextField } from "@material-ui/core";
import { useField } from "formik";
import React from "react";



interface Props {
    id: string,
    label: string,
    name: string,
    autoFocus?: boolean,
    multiline?: boolean,
    value?: string,
    className?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}


const InputField: React.FC<Props> = ({...props}) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        field.onChange(e);
        if(props.onChange){
            props.onChange(e)
        }
    }
    
    const value= () => {
        if(props.value){
            return field.value = props.value;
        }
        return field.value;
    }

    return(
    <TextField
        variant="standard"
        multiline={props.multiline}
        rows={4}
        margin="normal"
        fullWidth
        color="secondary"
        autoFocus={props.autoFocus}
        id={props.id}
        label={props.label}
        helperText={errorText}
        error={!!errorText}
        value={value()}
        onChange={e => onChangeHandler(e)}
        onBlur={field.onBlur}
        className={props.className}
    />
    )
};

export default InputField