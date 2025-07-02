import React from "react";

export default function ToggleSwitch ({label,checked,onChange}) {

return (

<label style={{ display:"flex",alignItems:"center",gap:"8px", cursor:"pointer,", marginRight:"20px" }}>
<input
type="checkbox"
checked={checked}
onChange={onChange}
style={{ width:"20px", height:"20px"}}
/>
<span>{label}</span>
</label>

);
}