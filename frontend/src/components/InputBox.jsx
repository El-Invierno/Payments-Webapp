export function InputBox({label,placeholder,onChange})
{
    return <div>
        <div className="text-sm font-medium text-left py-2">
            {label}
        </div>
        <input placeholder={placeholder} className="w-full border rounded border-slate-200 px-2 py-1" onChange={onChange}></input>
    </div>
}