import { EstadoDTO } from "./estado.dto";

export interface CidadeDTO{
    id: String;
    nome: string;
    estado? : EstadoDTO;
}