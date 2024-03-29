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

export const useGetAllWishes = (wishesUserMail: string) => {
	console.log("useGetAllWishes: ", wishesUserMail)

	return useQuery(["wishes", wishesUserMail], () => axios.request({
		method: "GET",
		url: `/wishes/${wishesUserMail}`,
		...axiosCfg
	}).then((res) => res.data).catch(err => {
		console.log("Err retrieving wishes: ", err);
	}).finally(() => netlifyIdentity.refresh().catch(() => netlifyIdentity.logout())))
};

export const usePostWish = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	return useMutation((wishToPost: IWish) => axios.request({
		method: "POST",
		url: "/wishes",
		data: wishToPost,
		...axiosCfg
	}), {
		onSuccess: ({ data: { data: wish } }: any) => {
			enqueueSnackbar("Nouvelle idée ajoutée !", { variant: "success" });
			queryClient.invalidateQueries(["wishes", wish.created.for]);
		},
		onError: (error) => {
			enqueueSnackbar("Une erreur est survenue...", { variant: "error" });
			console.log("Err POST wish: ", error);
		},
		onSettled: () => {
			netlifyIdentity.refresh().catch(() => netlifyIdentity.logout());
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
		onSuccess: ({ data: { data: wish } }: any) => {
			enqueueSnackbar("L'idée a été mise à jour !", { variant: "success" });
			queryClient.invalidateQueries(["wishes", wish.created.for]);
		},
		onError: (error) => {
			enqueueSnackbar("Une erreur est survenue...", { variant: "error" });
			console.log("Err PUT wish: ", error);
		},
		onSettled: () => {
			netlifyIdentity.refresh().catch(() => netlifyIdentity.logout());
		}
	})
};

export const usePatchWish = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	return useMutation(({ wishID, type, percentage }: { wishID: string, type: "REDEEM" | "REMOVE", percentage: number }) => axios.request({
		method: "PATCH",
		url: `/wishes/${wishID}`,
		data: {
			type,
			percentage
		},
		...axiosCfg
	}), {
		onSuccess: ({ data: { data: wish } }: any) => {
			enqueueSnackbar("Participation mise à jour !", { variant: "success" });
			queryClient.invalidateQueries(["wishes", wish.created.for]);
		},
		onError: (error) => {
			enqueueSnackbar("Une erreur est survenue...", { variant: "error" });
			console.log("Err PUT wish: ", error);
		},
		onSettled: () => {
			netlifyIdentity.refresh().catch(() => netlifyIdentity.logout());
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
		onSuccess: ({ data: { data: wish } }: any) => {
			enqueueSnackbar("Idée supprimée !", { variant: "success" });
			queryClient.invalidateQueries(["wishes", wish.created.for]);
		},
		onError: (error) => {
			enqueueSnackbar("Une erreur est survenue...", { variant: "error" });
			console.log("Err DELETE wish: ", error);
		},
		onSettled: () => {
			netlifyIdentity.refresh().catch(() => netlifyIdentity.logout());
		}
	})
};
