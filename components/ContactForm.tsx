"use client"

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

// Form schema validation using zod
const complaintFormSchema = z.object({
  student: z
    .string()
    .min(2, {
      message: "Student name must be at least 2 characters.",
    })
    .max(50, {
      message: "Student name must not be longer than 50 characters.",
    }),

  studentEmail: z
    .string({
      required_error: "Please enter your university email.",
    })
    .email(),

  complaintSubject: z
    .string()
    .min(5, {
      message: "Subject must be at least 5 characters.",
    })
    .max(100, {
      message: "Subject must not be longer than 100 characters.",
    }),

  mainComplaint: z
    .string()
    .min(10, {
      message: "Complaint must be at least 10 characters.",
    })
    .max(1000, {
      message: "Complaint must not be longer than 1000 characters.",
    }),
});

// Types for form values
type ComplaintFormValues = z.infer<typeof complaintFormSchema>;

// Default values for the form fields
const defaultValues: Partial<ComplaintFormValues> = {
  student: "",
  studentEmail: "",
  complaintSubject: "",
  mainComplaint: "",
};

const ComplaintForm = () => {
  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const submitForm = async (data: ComplaintFormValues) => {
    toast({
      title: "Submitting your complaint...",
    });

    setLoading(true);

    try {
      const response = await fetch("/api/complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error submitting complaint");
      }

      const responseData = await response.json();
      toast({
        variant: "default",
        title: "Complaint submitted!",
        description: "We will review your complaint and get back to you soon.",
      });

      setLoading(false);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed!",
        description: "There was an issue submitting your complaint. Please try again later.",
      });
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)} className="space-y-8">
        <FormField
          control={form.control}
          name="student"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please enter your full name as registered.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studentEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your university email"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                We'll only use this email to contact you regarding your complaint.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="complaintSubject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complaint Subject</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter the subject of your complaint"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief subject for your complaint.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mainComplaint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Complaint</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your complaint in detail"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide as much detail as possible to help us address your issue.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            Submit Complaint
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ComplaintForm;