import { useNavigate, useParams } from "react-router-dom";

const ActualizarEmpleado = () =>{
    const {id} = useParams()
    return(
        <h1>ActualizarEmpleadoAqui llego el Id {id}</h1>
    )
}

export default ActualizarEmpleado