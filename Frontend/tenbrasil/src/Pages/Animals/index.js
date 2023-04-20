import "bootstrap/dist/css/bootstrap.min.css";
import "./animals.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { RegisterForm } from "../../Components/RegisterForm";

const Animals = () => {

    const [ listOfAnimals, setListOfAnimals] = useState([]);
    const [ editLayer, setEditLayer] = useState(false);
    const [ string, setSearch ] = useState("");
    const [ statusInactive, setStatusInactive ] = useState(false);
    const [ statusAlteration, setChangeStatus ] = useState(true);

    const animalRes = {
        id: null,
        name: '',
        about: '',
        animaltype: '',
        image: '',
        status: true
    };

    const { control: controlEdit,
        register: registerEdit, 
        reset: resetEdit, 
        handleSubmit: handleSubmitEdit, 
        setValue: setValueEdit,
        getValues,
        formState: { errors: errorsEdit } 
    } = useForm({
            defaultValues: animalRes
    });

    function convertBase64(image) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            let imgBlob = new Blob(image);
            reader.readAsDataURL(imgBlob);
            reader.onload = (e) => {
              resolve(reader.result);
            } 
            reader.onerror = error => reject(error);
        });
    }

    const postForm = async (res) => {
        res.image = await convertBase64(res.image);
        console.log(res.imagem);

        axios.post("http://localhost:8000/api/animal", JSON.stringify(res), { headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }}).then( res => {
            console.log(res);
            listOfAnimals.push(res.data);
            getAll();
        }).catch(e => {
            console.log(e.response.data);
        })

    }

    const postResult = (res) => {
        postForm(res);
    }

    function remove(id) {
        console.log("delete");
        axios.delete(`http://localhost:8000/api/animal/${id}`).then(
            setListOfAnimals(listOfAnimals.filter((item) => item.id !== id))
        ).catch(e => {
            console.log(e.response.data);
        });
    }

    function changeStatus(id) {
        console.log("status");
        const toChange = listOfAnimals.filter((item) => item.id === id );
        if(toChange[0].status) {
            toChange[0].status = false;
        } else {
            toChange[0].status = true;
        }
        axios.put(`http://localhost:8000/api/animal/${id}`, toChange[0]).then(
            (res) => console.log(res)
        ).catch(e => {
            console.log(e.response.data);
        }).finally(() => {
            if(statusAlteration) {
                setChangeStatus(false);
            } else {
                setChangeStatus(true);
            }
        });
    }

    function edit(id) {
        console.log("edit");
        const toChange = listOfAnimals.filter((item) => item.id === id );
        setValueEdit("id", toChange[0].id);
        setValueEdit("name", toChange[0].name);
        setValueEdit("about", toChange[0].about);
        setValueEdit("animaltype", toChange[0].animaltype);
        setValueEdit("image", toChange[0].image);
        setValueEdit("status", toChange[0].status);
        setEditLayer(true);
    }

    function search(string) {
        console.log(string);
        axios.get(`http://localhost:8000/api/animal/search/${string}`)
        .then((res) => {
            setListOfAnimals(res.data);
            console.log(res);
        }).catch(e => {
            console.log(e.response.data);
        });
        document.getElementById("filter-input").value = "";
    }

    function unsearch() {
        getAll();
    }

    function save() {
        const toChange = getValues();
        axios.put(`http://localhost:8000/api/animal/${toChange.id}`, toChange)
        .then((res) => console.log(res)
        ).catch(e => {
            console.log(e.response.data);
        }).finally(() => {
            getAll();
            setEditLayer(false);
        });
    }

    function showInactive() {
        if(statusInactive) {
            setStatusInactive(false);
        } else {
            setStatusInactive(true);
        }
    }

    function getAll() {
        console.log("get");
        axios.get("http://localhost:8000/api/animal")
        .then((res) => setListOfAnimals(res.data)
        ).catch(e => {
            console.log(e.response.data);
        })
    }

    useEffect(() => {
        getAll();
    }, []);

    useEffect(() => {
        if(editLayer === true) {
            const modal = document.getElementById("edit-screen");
    
            modal.addEventListener("click", function(e) {
                if(e.target === this)
                    setEditLayer(false); 
            });
        }
    }, [editLayer]);

    return(
        <div>
            <div id="filter">
                <div className="search">
                    <input type="text" id="filter-input" aria-label="Name" className="form-control" onChange={(e) => setSearch(e.target.value)}/>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => search(string)}>Filtrar</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => unsearch(string)}>Retirar filtros</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={showInactive}>{statusInactive ? "Mostrar Ativos" : "Mostrar Inativos"}</button>
                </div>
            </div>
            <div id="animal">
                {/* This is a component that render the form, is just a better form to build a react app  */}
                {<RegisterForm handleRes={postResult}></RegisterForm>}
                { !statusInactive ? <div id="carrousel">
                    {listOfAnimals.map((item) => {
                        const {id, name, about, animaltype, image, status} = item;

                        return( status ?
                            <div className="item" key={id}>
                                <div className="image">
                                    <img src={image} alt={name}></img>
                                </div>
                                <div className="info">
                                    <span className="name">Nome: {name}</span>
                                    <span className="about">Descrição: {about}</span>
                                    <span className="type">Tipo: {animaltype}</span>
                                </div>    
                                <div id="change-button">
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => remove(id)}>Remover</button>
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => changeStatus(id)}>Inativar</button>
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => edit(id)}>Editar</button>
                                </div>
                            </div> : <div></div>
                        );
                    })}
                </div> : <div></div>}
                { statusInactive ? <div id="carrousel">
                    {listOfAnimals.map((item) => {
                        const {id, name, about, animaltype, image, status} = item;

                        return( !status &&
                            <div className="item" key={id}>
                                <div className="image">
                                    <img src={image} alt={name}></img>
                                </div>
                                <div className="info">
                                    <span className="name">Nome: {name}</span>
                                    <span className="about">Descrição: {about}</span>
                                    <span className="type">Tipo: {animaltype}</span>
                                </div>    
                                <div id="change-button">
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => remove(id)}>Remover</button>
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => changeStatus(id)}>Ativar</button>
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => edit(id)}>Editar</button>
                                </div>
                            </div>
                        );
                    })}
                </div> : <div></div>}
                {editLayer ? (
                        <div id="edit-screen">
                            <div id="edit-screen-content">
                                <form id="animal-form" onSubmit={handleSubmitEdit(save)} >
                                    <div className="input-group">
                                        <span className="input-group-text">Nome:</span>
                                        <input type="text" aria-label="Name" className="form-control" { ...registerEdit("name") }/>
                                    </div>
                                    <div className="mb-3">
                                        <label for="exampleFormControlTextarea1" className="form-label">Descrição:</label>
                                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" { ...registerEdit("about") } ></textarea>
                                    </div>
                                    <div>
                                        <select id="select" className="form-select" aria-label="Default select example" { ...registerEdit("animaltype") }>
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
                                    <button className="btn btn-secondary btn-sm">Salvar</button>
                                </form>
                            </div>
                        </div>
                    ) : <div></div>
                    } 
            </div>
        </div>
    );
}

export default Animals;