import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Chamado } from "src/app/models/chamado";
import { Cliente } from "src/app/models/cliente";
import { Tecnico } from "src/app/models/tecnico";
import { ChamadoService } from "src/app/services/chamado.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-chamado-read",
  templateUrl: "./chamado-read.component.html",
  styleUrls: ["./chamado-read.component.css"],
})
export class ChamadoReadComponent implements OnInit {
  chamado: Chamado = {
    prioridade: "",
    status: "",
    titulo: "",
    observacoes: "",
    tecnico: "",
    cliente: "",
    nomeCliente: "",
    nomeTecnico: "",
  };

  clientes: Cliente[] = [];
  tecnicos: Tecnico[] = [];

  prioridade: FormControl = new FormControl(null, Validators.required);
  status: FormControl = new FormControl(null, Validators.required);
  titulo: FormControl = new FormControl(null, Validators.required);
  observacoes: FormControl = new FormControl(null, Validators.required);
  tecnico: FormControl = new FormControl(null, Validators.required);
  cliente: FormControl = new FormControl(null, Validators.required);

  constructor(
    private chamadoService: ChamadoService,
    private toastService: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.chamado.id = this.route.snapshot.paramMap.get("id");
    this.findById();
  }

  findById(): void {
    this.chamadoService.findById(this.chamado.id).subscribe(
      (resposta) => {
        this.chamado = resposta;
      },
      (ex) => {
        this.toastService.error(ex.error.error);
      }
    );
  }

  retornaStatus(status: any): String {
    switch (status) {
      case 0:
        return "AGUARDANDO_ATENDIMENTO";
        break;
      case 1:
        return "EM_ATENDIMENTO";
        break;
      case 2:
        return "PAUSADO";
        break;
      case 3:
        return "ENCERRADO";
        break;
      default:
        return "ENCERRADO";
        break;
    }
  }
  retornaPrioridade(prioridade: any): string {
    switch (prioridade) {
      case 0:
        return "BAIXA";
        break;
      case 1:
        return "MEDIA";
        break;
      case 2:
        return "ALTA";
        break;
    }
    return "ALTA";
  }
}
