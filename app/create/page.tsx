'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

const formSchema = z.object({
  ownerEmail: z.string().email({ message: "Invalid email address" }),
  ownerFirstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  ownerLastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  signerEmail: z.string().email({ message: "Invalid email address" }),
  signerFirstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  signerLastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
});

export default function CreateDocument() {
  const { address } = useAccount();
  const { token, login } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownerEmail: "",
      ownerFirstName: "",
      ownerLastName: "",
      signerEmail: "",
      signerFirstName: "",
      signerLastName: "",
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    noClick: true, // Disable default click to handle it manually if needed, or keep it enabled. Let's try explicit button.
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!file || !address) return;

    setIsUploading(true);
    try {
      // Ensure we have an auth token
      let authToken = token;
      if (!authToken) {
        try {
          const authData = await login();
          authToken = authData.token;
        } catch (authError) {
          console.error('Authentication failed:', authError);
          alert('Authentication failed. Please sign the message to continue.');
          setIsUploading(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('ownerEmail', values.ownerEmail);
      formData.append('ownerFirstName', values.ownerFirstName);
      formData.append('ownerLastName', values.ownerLastName);
      formData.append('signerEmail', values.signerEmail);
      formData.append('signerFirstName', values.signerFirstName);
      formData.append('signerLastName', values.signerLastName);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      // Show success message and redirect to dashboard instead of document details
      alert("Document created successfully! You will be redirected to the dashboard.");
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-24">
      <Card className="w-full max-w-2xl bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Create New Document</CardTitle>
          <CardDescription>
            Upload a document and invite someone to sign it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerFirstName">First Name</Label>
                  <Input
                    id="ownerFirstName"
                    placeholder="John"
                    {...form.register("ownerFirstName")}
                  />
                  {form.formState.errors.ownerFirstName && (
                    <p className="text-sm text-destructive">{form.formState.errors.ownerFirstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerLastName">Last Name</Label>
                  <Input
                    id="ownerLastName"
                    placeholder="Doe"
                    {...form.register("ownerLastName")}
                  />
                  {form.formState.errors.ownerLastName && (
                    <p className="text-sm text-destructive">{form.formState.errors.ownerLastName.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerEmail">Email</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  placeholder="john@example.com"
                  {...form.register("ownerEmail")}
                />
                {form.formState.errors.ownerEmail && (
                  <p className="text-sm text-destructive">{form.formState.errors.ownerEmail.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Signer Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signerFirstName">First Name</Label>
                  <Input
                    id="signerFirstName"
                    placeholder="Jane"
                    {...form.register("signerFirstName")}
                  />
                  {form.formState.errors.signerFirstName && (
                    <p className="text-sm text-destructive">{form.formState.errors.signerFirstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signerLastName">Last Name</Label>
                  <Input
                    id="signerLastName"
                    placeholder="Smith"
                    {...form.register("signerLastName")}
                  />
                  {form.formState.errors.signerLastName && (
                    <p className="text-sm text-destructive">{form.formState.errors.signerLastName.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signerEmail">Email</Label>
                <Input
                  id="signerEmail"
                  type="email"
                  placeholder="jane@example.com"
                  {...form.register("signerEmail")}
                />
                {form.formState.errors.signerEmail && (
                  <p className="text-sm text-destructive">{form.formState.errors.signerEmail.message}</p>
                )}
              </div>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary'
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="flex items-center justify-center gap-2 text-primary">
                  <FileText className="h-8 w-8" />
                  <span className="text-lg font-medium">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-8 w-8" />
                  <p>Drag & drop a file here, or click to select</p>
                  <p className="text-sm">PDF, DOCX, TXT, Images (max 10MB)</p>
                  <Button type="button" variant="secondary" onClick={open}>
                    Select File
                  </Button>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isUploading || !file}>
              {isUploading ? "Creating Document..." : "Create Document"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
