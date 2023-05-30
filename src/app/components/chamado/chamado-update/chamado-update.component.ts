import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Chamado } from "src/app/models/chamado";
import { Cliente } from "src/app/models/cliente";
import { Tecnico } from "src/app/models/tecnico";
import { ChamadoService } from "src/app/services/chamado.service";
import { ClienteService } from "src/app/services/cliente.service";
import { TecnicoService } from "src/app/services/tecnico.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-chamado-update",
  templateUrl: "./chamado-update.component.html",
  styleUrls: ["./chamado-update.component.css"],
})
export class ChamadoUpdateComponent implements OnInit {
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
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService,
    private toastService:    ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.findAllCliente();
    this.findAllTecnicos();
    this.chamado.id = this.route.snapshot.paramMap.get("id");
    this.findById();
    this.findAllCliente();
    this.findAllCliente();
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
  update(): void {
    this.chamadoService.update(this.chamado).subscribe(resposta => {
      this.toastService.success('Chamado atualizado com sucesso', 'Atualizar chamado');
      this.router.navigate(['chamados']);
    }, ex => {
      this.toastService.error(ex.error.error);
    })
  }
  findAllCliente(): void {
    this.clienteService.findAll().subscribe((resposta) => {
      this.clientes = resposta;
    });
  }
  findAllTecnicos(): void {
    this.tecnicoService.findAll().subscribe((resposta) => {
      this.tecnicos = resposta;
    });
  }

  validaCampos(): boolean {
    return (
      this.prioridade.valid &&
      this.status.valid &&
      this.titulo.valid &&
      this.observacoes.valid &&
      this.tecnico.valid &&
      this.cliente.valid
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
  prioridadeColor(x: any) {
    if (x == "BAIXA") {
      return "BAIXA";
    } else if (x == "MEDIA") {
      return "MEDIA";
    } else {
      return "ALTA";
    }
  }
}
