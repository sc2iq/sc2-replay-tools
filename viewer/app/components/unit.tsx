type Props = {
    name: string
}

export const Unit: React.FC<Props> = props => {
    return (
        <div className="unit">{props.name}</div>
    )
}