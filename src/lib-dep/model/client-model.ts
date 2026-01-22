import { ModelView } from './model';

export interface ModelEndpoints<K = unknown> {
  get?: (params?: K) => string;
  patch?: (args?: K) => string;
}

export default abstract class ClientModel<T, K> {
  abstract url: ModelEndpoints<K>;

  async request(params?: K): Promise<ModelView<T>> {
    if (!this.url.get) {
      throw new Error("ClientModel does not have url.get endpoint defined");
    }
    try {
      const response = await fetch(this.url.get(params), {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
      })

      const validated = await this.validate(await response.json() as T) 
      return validated;
    } catch (error) {
      throw new ClientModelError("Request", `Error requesting ModelView from api. Trace: \n${error.message ?? ""}`)
    }
  }

  async validate(data: unknown): Promise<ModelView<T>> {
    return data as ModelView<T>;
  }
}

type ClientModelErrorType = "Request" | "Patch"

class ClientModelError extends Error {
  type: ClientModelErrorType;
  override message: string;

  constructor(type: ClientModelErrorType, message: string) {
    super(message)
    this.type = type;
    this.message = message;
  }
}
