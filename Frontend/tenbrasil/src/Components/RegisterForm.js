import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";


export const RegisterForm  = ( props ) => {

    const animal = {
        name: '',
        about: '',
        animaltype: '',
        image: '',
        status: true
    };

    const { control: controlCreate,
        register: registerCreate, 
        reset: resetCreate, 
        handleSubmit: handleSubmitCreate, 
        setValue: setValueCreate,
        formState: { errors: errorsCreate } 
    } = useForm({
            defaultValues: animal
    });

    const submit = (controlCreate) => {
        props.handleRes(controlCreate);
        resetCreate();
    }

    return(
        <form id="animal-form" onSubmit={handleSubmitCreate(submit)} >
            <div className="input-group">
                <span className="input-group-text">Nome:</span>
                <input type="text" aria-label="Name" className="form-control" { ...registerCreate("name") }/>
            </div>
            <div className="mb-3">
                <label id="selecao" for="formFile" className="form-label">Selecione uma imagem (formato ideal, quadrado):</label>
                <input className="form-control" type="file" id="formFile" { ...registerCreate("image") } />
            </div>
            <div className="mb-3">
                <label for="exampleFormControlTextarea1" className="form-label">Descrição</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" { ...registerCreate("about") } ></textarea>
            </div>
            <div>
                <select id="select" className="form-select" aria-label="Default select example" { ...registerCreate("animaltype") }>
                  <option selected>Selecione o tipo:</option>
                  <option value="Mamífero">Mamífero</option>
                  <option value="Ave">Ave</option>
                  <option value="Peixe">Peixe</option>
                  <option value="Anfíbio">Anfíbio</option>
                  <option value="Réptil">Réptil</option>
                  <option value="Aracnídeo">Aracnídeo</option>
                  <option value="Inseto">Inseto</option>
                  <option value="Crustáceo">Crustáceo</option>
                </select>
            </div>
            <button className="btn btn-secondary btn-sm">Criar</button>
        </form>
    );
}