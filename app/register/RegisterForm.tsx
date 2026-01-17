"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";

const formSchema = z.object({
  college_name: z.string().min(2, {
    message: "College name must be at least 2 characters.",
  }),
  email: z.string().optional(),
  contact_number: z.string().min(10, {
    message: "Contact number must be at least 10 digits.",
  }),
  register_number: z.string().min(2, {
    message: "Register number is required.",
  }),
  department: z.string({
    required_error: "Please select a department.",
  }),
  year: z.string({
    required_error: "Please select your year of study.",
  }),
  texus_id: z.string(),
  avatar_url: z.string().optional(),
});

const departments = [
  "Computer Science and Engineering",
  "Information Technology",
  "Electronics and Communication",
  "Electrical and Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Biomedical Engineering",
  "Biotechnology",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

// Props from server component
interface RegisterFormProps {
  user: User;
  userData: UserProfile | null;
  userExists: boolean;
  existingTexusId: string;
}

// Add type for form fields
type FormField = ControllerRenderProps<z.infer<typeof formSchema>>;

export default function RegisterForm({
  user,
  userData,
  userExists,
  existingTexusId,
}: RegisterFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [texusId, setTexusId] = useState(existingTexusId || "");

  // Helper function to convert year number to full string (e.g., 1 -> "1st Year")
  const getYearSuffix = (year: number): string => {
    const yearMap: Record<number, string> = {
      1: "st Year",
      2: "nd Year",
      3: "rd Year",
      4: "th Year",
    };
    return yearMap[year] || "st Year";
  };

  useEffect(() => {
    // Only generate a new texusId if one wasn't already provided
    if (texusId === "" && !userExists) {
      const generateUniqueTexusId = async () => {
        let isUnique = false;
        let newTexusId = "";

        while (!isUnique) {
          // Generate random 4 digit number
          const random = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0");
          newTexusId = `Tx25${random}`;

          // Check if ID exists in database
          const { data, error } = await supabase
            .from("users")
            .select("texus_id")
            .eq("texus_id", newTexusId)
            .single();

          if (error || !data) {
            // ID doesn't exist, we can use it
            isUnique = true;
            setTexusId(newTexusId);
          }
        }
      };

      generateUniqueTexusId();
    }
  }, [texusId, userExists]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      college_name: userData?.college || "",
      email: user?.email || "",
      contact_number: userData?.contact_number?.toString() || "",
      register_number: userData?.register_number || "",
      department: userData?.department || "",
      year: userData?.year
        ? `${userData.year}${getYearSuffix(userData.year)}`
        : "",
      texus_id: texusId,
      avatar_url: user?.user_metadata?.avatar_url,
    },
  });

  // Update form when texusId is generated
  useEffect(() => {
    if (texusId) {
      form.setValue("texus_id", texusId);
    }
  }, [texusId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    try {
      if (userExists) {
        // Update existing record
        const { data, error } = await supabase
          .from("users")
          .update({
            user_auth_id: user.id,
            college: values.college_name,
            contact_number: values.contact_number,
            register_number: values.register_number,
            department: values.department,
            year: Number(values.year.split(" ")[0][0]),
            name: user?.user_metadata?.full_name,
            profile_pic: user?.user_metadata?.avatar_url,
          })
          .eq("email", user.email)
          .select();

        if (error) {
          console.error("Error updating profile:", error);
        }

        if (data) {
          console.log("Profile updated successfully");
          router.replace("/");
        }
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from("users")
          .insert([
            {
              user_auth_id: user.id,
              texus_id: texusId,
              college: values.college_name,
              contact_number: values.contact_number,
              register_number: values.register_number,
              department: values.department,
              year: Number(values.year.split(" ")[0][0]),
              name: user?.user_metadata?.full_name,
              email: user?.email,
              profile_pic: user?.user_metadata?.avatar_url,
            },
          ])
          .select();

        if (error) {
          console.error("Error saving profile:", error);
        }

        if (data) {
          console.log("Profile saved successfully");
          router.replace("/");
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSubmitting(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Add these new variants for input animations
  const inputVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    focus: {
      scale: 1.02,
      transition: {
        duration: 0.2,
      },
    },
  };

  const radioVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-16 bg-gradient-to-br from-slate-950 via-black to-purple-950">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <Card className="border border-violet-500/20 bg-black/50 backdrop-blur-md">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-mont text-center bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 text-transparent bg-clip-text">
                Complete Your Registration
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <motion.form
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 md:space-y-8"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex justify-center"
                >
                  <FormField
                    control={form.control}
                    name="avatar_url"
                    render={({ field }: { field: FormField }) => (
                      <FormItem className="text-center">
                        <FormLabel className="text-violet-300 text-sm md:text-base font-mont">
                          Profile Picture
                        </FormLabel>
                        <div className="flex flex-col items-center space-y-3">
                          <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-violet-500/20">
                            <Image
                              src={
                                user?.user_metadata?.avatar_url ||
                                "https://api.dicebear.com/7.x/avataaars/svg"
                              }
                              alt="Profile"
                              width={96}
                              height={96}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-violet-300/70 font-mont">
                            Profile picture
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="college_name"
                      render={({ field }: { field: FormField }) => (
                        <FormItem>
                          <FormLabel className="text-violet-300 text-sm md:text-base font-mont">
                            College/University Name
                          </FormLabel>
                          <FormControl>
                            <motion.div
                              variants={inputVariants}
                              initial="initial"
                              animate="animate"
                              whileFocus="focus"
                            >
                              <Input
                                placeholder="Enter your college name"
                                className="border-violet-500/20 font-mont bg-black/50 text-white text-sm md:text-base p-2 md:p-3 focus:border-violet-400 focus:ring-violet-400"
                                {...field}
                                disabled={userExists}
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }: { field: FormField }) => (
                        <FormItem>
                          <FormLabel className="text-violet-300 text-sm md:text-base font-mont">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={user?.email || ""}
                              disabled
                              className="border-violet-500/20 bg-black/50 text-white text-sm md:text-base p-2 md:p-3 font-mont"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="contact_number"
                      render={({ field }: { field: FormField }) => (
                        <FormItem>
                          <FormLabel className="text-violet-300 text-sm md:text-base font-mont">
                            Contact Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your contact number"
                              className="border-violet-500/20 bg-black/50 text-white text-sm md:text-base p-2 md:p-3 font-mont"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="register_number"
                      render={({ field }: { field: FormField }) => (
                        <FormItem>
                          <FormLabel className="text-violet-300 text-sm md:text-base font-mont">
                            Register Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your register number"
                              className="border-violet-500/20 bg-black/50 text-white text-sm md:text-base p-2 md:p-3 font-mont"
                              {...field}
                              disabled={userExists}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }: { field: FormField }) => (
                        <FormItem>
                          <FormLabel className="text-violet-300 text-sm md:text-base font-mont">
                            Department
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your department"
                              className="border-violet-500/20 bg-black/50 text-white text-sm md:text-base p-2 md:p-3 font-mont"
                              {...field}
                              disabled={userExists}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="texus_id"
                      render={({ field }: { field: FormField }) => (
                        <FormItem>
                          <FormLabel className="text-violet-300 text-sm md:text-base font-mont">
                            Texus ID
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={texusId}
                              disabled
                              className="border-violet-500/20 bg-black/50 text-white text-sm md:text-base p-2 md:p-3 font-mont"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }: { field: FormField }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-violet-300 text-sm md:text-base font-mont">
                          Year of Study
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 md:grid-cols-4 gap-2"
                            disabled={userExists}
                          >
                            {years.map((year) => (
                              <FormItem
                                key={year}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <motion.div
                                    variants={radioVariants}
                                    initial="initial"
                                    animate="animate"
                                    whileHover="hover"
                                  >
                                    <RadioGroupItem value={year} />
                                  </motion.div>
                                </FormControl>
                                <FormLabel className="font-normal text-white font-mont">
                                  {year}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full font-bangers bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 hover:from-violet-600 hover:via-fuchsia-600 hover:to-pink-600 text-white text-sm md:text-xl py-2 md:py-3 transition-all duration-300"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        <span>
                          {userExists ? "Updating..." : "Submitting..."}
                        </span>
                      </div>
                    ) : (
                      <span>
                        {userExists
                          ? "Update Registration"
                          : "Complete Registration!"}
                      </span>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
