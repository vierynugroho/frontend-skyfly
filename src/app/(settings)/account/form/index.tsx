"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Labels } from "@/components/ui/labels";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "./validation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import { editProfile, getUserName } from "./actions";
import { getCookie } from "cookies-next";
import { PhoneInput } from "@/components/ui/phone-input";
import toast from "react-hot-toast";

export default function FormAccount({ isEdit }: { isEdit: boolean }) {
  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      familyName: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    const getName = async () => {
      try {
        const token = getCookie("token") as string | undefined;
        if (token) {
          const data = await getUserName(token);
          form.setValue("name", data.name);
          form.setValue("familyName", data.familyName);
          form.setValue("phoneNumber", data.phoneNumber);
          form.setValue("email", data.email);
        } else {
          console.error("Token not found");
        }
      } catch (err) {
        console.error("Error fetching user name:", err);
      }
    };

    getName();
  }, [form]);

  const onSubmit = async (data: z.infer<typeof accountSchema>) => {
    // console.log(data);
    const token = getCookie("token");
    if (typeof token !== "string") {
      toast.error("Token is missing or invalid.", {
        style: {
          fontWeight: "bold",
        },
      });
      return;
    }

    const requestData = { ...data, token };

    try {
      const response = await editProfile(requestData);
      // console.log(response);
      if (response.status) {
        toast.success(response.message, {
          style: {
            fontWeight: "bold",
          },
        });
      } else {
        toast.error(response.message, {
          style: {
            fontWeight: "bold",
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col">
      <div>
        <Labels className="font-bold">Edit Profile Data</Labels>
      </div>
      <div className="bg-black rounded-t-xl mt-3 text-white p-3">
        <Labels className="font-bold">Personal Data</Labels>
      </div>
      <div className="px-5 py-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-1"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Harry"
                      autoComplete="off"
                      disabled={!isEdit}
                      {...field}
                      className={
                        form.formState.errors.name
                          ? "border-red-700"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage style={{ marginTop: "1px" }} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="familyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="familyName">
                    Family Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="familyName"
                      type="text"
                      placeholder="Potter"
                      autoComplete="off"
                      disabled={!isEdit}
                      {...field}
                      className={
                        form.formState.errors.familyName
                          ? "border-red-700"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage style={{ marginTop: "1px" }} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phoneNumber">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      id="phoneNumber"
                      autoComplete="off"
                      placeholder="875 7436 1473"
                      disabled={!isEdit}
                      {...field}
                      className={
                        form.formState.errors.phoneNumber
                          ? "border-red-700"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage style={{ marginTop: "1px" }} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jhondoe@gmail.com"
                      autoComplete="off"
                      disabled={!isEdit}
                      readOnly
                      {...field}
                      className={
                        form.formState.errors.email
                          ? "border-red-700"
                          : ""
                      }
                      style={{ marginBottom: "7px" }}
                    />
                  </FormControl>
                  <FormMessage
                    style={{ marginBottom: "7px", marginTop: "1px" }}
                  />
                </FormItem>
              )}
            />
            {isEdit && (
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
