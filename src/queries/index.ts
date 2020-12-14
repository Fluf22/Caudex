import axios, { AxiosRequestConfig } from "axios";
import { useQueryClient, useMutation, useQuery } from "react-query";
import netlifyIdentity from 'netlify-identity-widget';
import { IWish } from "../interfaces";
import { useSnackbar } from 'notistack';

const axiosCfg: AxiosRequestConfig = {
	baseURL: "/.netlify/functions",
	headers: {
		Authorization: "Bearer " + netlifyIdentity.currentUser()?.token?.access_token
	}
};

export const useGetAllWishes = () => useQuery("wishes", () => axios.request({
	method: "GET",
	url: "/wishes",
	...axiosCfg
}).then((res) => res.data));

export const usePostWish = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	return useMutation((wishToPost: IWish) => axios.request({
		method: "POST",
		url: "/wishes",
		data: wishToPost,
		...axiosCfg
	}), {
		onSuccess: () => {
			enqueueSnackbar("Nouvelle idée ajoutée !", { variant: "success" });
			queryClient.invalidateQueries("wishes");
		},
		onError: () => {
			enqueueSnackbar("Une erreur est survenue...", { variant: "error" });
		}
	})
};

export const usePutWish = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	return useMutation(({ wishID, wishToPost }: { wishID: string, wishToPost: IWish }) => axios.request({
		method: "PUT",
		url: `/wishes/${wishID}`,
		data: wishToPost,
		...axiosCfg
	}), {
		onSuccess: () => {
			enqueueSnackbar("L'idée a été mise à jour !", { variant: "success" });
			queryClient.invalidateQueries("wishes");
		},
		onError: () => {
			enqueueSnackbar("Une erreur est survenue...", { variant: "error" });
		}
	})
};

export const useDeleteWish = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	return useMutation((wishID: string) => axios.request({
		method: "DELETE",
		url: `/wishes/${wishID}`,
		...axiosCfg
	}), {
		onSuccess: () => {
			enqueueSnackbar("Idée supprimée !", { variant: "success" });
			queryClient.invalidateQueries("wishes");
		},
		onError: () => {
			enqueueSnackbar("Une erreur est survenue...", { variant: "error" });
		}
	})
};
