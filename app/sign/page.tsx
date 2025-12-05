'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useAccount, useSignMessage } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, AlertCircle, FileText, Download, FileSignature } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const signSchema = z.object({
  signerFirstName: z.string().min(2, "First name is required"),
  signerLastName: z.string().min(2, "Last name is required"),
  signerEmail: z.string().email("Invalid email"),
});

function SignDocumentContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { signMessageAsync } = useSignMessage();
  
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signSchema>>({
    resolver: zodResolver(signSchema),
    defaultValues: {
      signerFirstName: '',
      signerLastName: '',
      signerEmail: '',
    }
  });

  useEffect(() => {
    if (token) {
      fetchDocument(token);
    } else {
      setLoading(false);
      setError('No token provided');
    }
  }, [token]);

  const fetchDocument = async (docToken: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/document/${docToken}`);
      setDocument(response.data);
      form.reset({
        signerEmail: response.data.signerEmail,
        signerFirstName: response.data.signerFirstName || '',
        signerLastName: response.data.signerLastName || '',
      });
    } catch (err) {
      setError('Failed to load document. It may have expired or is invalid.');
    } finally {
      setLoading(false);
    }
  };

  const onSign = async (values: z.infer<typeof signSchema>) => {
    if (!address) return;
    setSigning(true);
    setError(null);

    try {
      // Show a message to the user to check their wallet
      // You could use a toast here if available
      console.log("Requesting signature...");

      const message = `I confirm that I am signing document: ${document.fileName}`;
      const signature = await signMessageAsync({ message });

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sign/${token}`, {
        signerAddress: address,
        signerEmail: values.signerEmail,
        signerFirstName: values.signerFirstName,
        signerLastName: values.signerLastName,
        signature,
        message,
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to sign document. Please try again.');
    } finally {
      setSigning(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="flex justify-center p-8 text-red-500"><AlertCircle className="mr-2" /> {error}</div>;
  if (success) return (
    <div className="container mx-auto p-8 max-w-md text-center">
      <Card>
        <CardContent className="pt-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Document Signed!</h2>
          <p className="text-gray-500 mb-4">The document has been successfully signed and recorded on the blockchain.</p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => window.location.href = '/'}>Go Home</Button>
            {document?.downloadUrl && (
              <Button variant="outline" onClick={() => window.open(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') + document.downloadUrl, '_blank')}>
                <Download className="w-4 h-4 mr-2" /> Download Signed Document
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Sign Document</CardTitle>
          <CardDescription>Please review and sign the document below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg space-y-2">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Document Info
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">File Name:</span>
              <span className="font-medium truncate">{document?.fileName}</span>
              
              <span className="text-muted-foreground">Size:</span>
              <span>{(document?.fileSize / 1024).toFixed(2)} KB</span>

              <span className="text-muted-foreground">Owner:</span>
              <span className="font-medium">{document?.ownerFirstName} {document?.ownerLastName}</span>
              
              <span className="text-muted-foreground">Created:</span>
              <span>{new Date(document?.createdAt).toLocaleDateString()}</span>
            </div>
            
            {document?.downloadUrl && (
               <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => window.open(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') + document.downloadUrl, '_blank')}>
                 <Download className="w-4 h-4 mr-2" /> Preview / Download Document
               </Button>
            )}
          </div>

          {!isConnected ? (
            <div className="text-center p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900">
              <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="mb-4 text-sm font-medium">Please connect your wallet to sign this document.</p>
              <div className="flex justify-center">
                 <Button onClick={openConnectModal} variant="default">Connect Wallet</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSign)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signerFirstName">First Name</Label>
                  <Input id="signerFirstName" {...form.register("signerFirstName")} disabled />
                  {form.formState.errors.signerFirstName && <p className="text-red-500 text-xs">{form.formState.errors.signerFirstName.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signerLastName">Last Name</Label>
                  <Input id="signerLastName" {...form.register("signerLastName")} disabled />
                  {form.formState.errors.signerLastName && <p className="text-red-500 text-xs">{form.formState.errors.signerLastName.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signerEmail">Email</Label>
                <Input id="signerEmail" {...form.register("signerEmail")} disabled />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={signing}>
                  {signing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSignature className="mr-2 h-4 w-4" />}
                  {signing ? 'Check Wallet...' : 'Sign Document'}
                </Button>
                {signing && (
                    <p className="text-xs text-center text-muted-foreground mt-2 animate-pulse">
                        Please confirm the signature in your wallet...
                    </p>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignDocument() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>}>
      <SignDocumentContent />
    </Suspense>
  );
}
