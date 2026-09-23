import { EventEmitter } from "node:events";

/**
 * Bus de eventos compartido: desacopla quien genera un evento (el service)
 * de quienes reaccionan a el (logging, notificaciones), sin que unos
 * conozcan a los otros.
 */
export const eventos = new EventEmitter();
