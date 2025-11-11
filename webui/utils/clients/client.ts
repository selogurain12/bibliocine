import { AppRouter } from "@ts-rest/core";
import { initQueryClient } from "@ts-rest/react-query";

const apiUrl = import.meta.env.VITE_API_URL;

export function createClient<Tcontract extends AppRouter>(
	contract: Tcontract,
	token: string | null
) {
	const baseHeader = token ? `Bearer ${token}` : "";

	return initQueryClient(contract, {
		baseUrl: apiUrl,
		baseHeaders: {
			"Content-Type": "application/json",
			Authorization: baseHeader,
		},
	});
}