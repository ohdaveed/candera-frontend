# shadcn/ui - UI Components Reference

## Button

```bash
npx shadcn@latest add button
```

```tsx
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Variants: default | destructive | outline | secondary | ghost | link
// Sizes: default | sm | lg | icon
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button size="sm">Small</Button>
<Button size="icon"><Icon className="h-4 w-4" /></Button>

// Loading state
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Please wait
</Button>
```

## Input & Label

```bash
npx shadcn@latest add input label
```

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Basic input
<Input type="email" placeholder="Email" />

// Input with label
<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>

// Input with button
<div className="flex w-full max-w-sm items-center gap-2">
  <Input type="email" placeholder="Email" />
  <Button type="submit" variant="outline">Subscribe</Button>
</div>
```

## Card

```bash
npx shadcn@latest add card
```

```tsx
<<<<<<< HEAD
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
=======
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
>>>>>>> origin/master

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Deploy</Button>
  </CardFooter>
<<<<<<< HEAD
</Card>;
=======
</Card>
>>>>>>> origin/master
```

## Dialog (Modal)

```bash
npx shadcn@latest add dialog
```

```tsx
import {
<<<<<<< HEAD
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
=======
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
>>>>>>> origin/master

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Make changes to your profile here.</DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
<<<<<<< HEAD
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
=======
        <Label htmlFor="name" className="text-right">Name</Label>
>>>>>>> origin/master
        <Input id="name" className="col-span-3" />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
<<<<<<< HEAD
</Dialog>;
=======
</Dialog>
>>>>>>> origin/master
```

## Sheet (Slide-over)

```bash
npx shadcn@latest add sheet
```

```tsx
import {
<<<<<<< HEAD
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
=======
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet"
>>>>>>> origin/master

// sides: top | right | bottom | left (default: right)
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Configure your application settings.</SheetDescription>
    </SheetHeader>
    {/* Sheet content */}
  </SheetContent>
<<<<<<< HEAD
</Sheet>;
=======
</Sheet>
>>>>>>> origin/master
```

## Select (Dropdown)

```bash
npx shadcn@latest add select
```

```tsx
<<<<<<< HEAD
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
=======
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
>>>>>>> origin/master

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="orange">Orange</SelectItem>
  </SelectContent>
<<<<<<< HEAD
</Select>;
=======
</Select>
>>>>>>> origin/master
```

## Toast Notifications

```bash
npx shadcn@latest add toast
```

Add `<Toaster />` to root layout:

```tsx
// app/layout.tsx
<<<<<<< HEAD
import { Toaster } from "@/components/ui/toaster";
=======
import { Toaster } from "@/components/ui/toaster"
>>>>>>> origin/master

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> origin/master
}
```

Using toast:

```tsx
<<<<<<< HEAD
import { useToast } from "@/components/ui/use-toast";

export function ToastDemo() {
  const { toast } = useToast();
=======
import { useToast } from "@/components/ui/use-toast"

export function ToastDemo() {
  const { toast } = useToast()
>>>>>>> origin/master

  return (
    <Button onClick={() => toast({ title: "Success", description: "Changes saved." })}>
      Show Toast
    </Button>
<<<<<<< HEAD
  );
}

// Variants
toast({ title: "Success", description: "Changes have been saved." });
toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
toast({ title: "Undo?", action: <ToastAction altText="Undo">Undo</ToastAction> });
=======
  )
}

// Variants
toast({ title: "Success", description: "Changes have been saved." })
toast({ variant: "destructive", title: "Error", description: "Something went wrong." })
toast({ title: "Undo?", action: <ToastAction altText="Undo">Undo</ToastAction> })
>>>>>>> origin/master
```

## Table

```bash
npx shadcn@latest add table
```

```tsx
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

const invoices = [
  { invoice: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { invoice: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
]

<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((invoice) => (
      <TableRow key={invoice.invoice}>
        <TableCell className="font-medium">{invoice.invoice}</TableCell>
        <TableCell>{invoice.status}</TableCell>
        <TableCell>{invoice.method}</TableCell>
        <TableCell className="text-right">{invoice.amount}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Menubar & Navigation

```bash
npx shadcn@latest add menubar
```

```tsx
import {
<<<<<<< HEAD
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
=======
  Menubar, MenubarContent, MenubarItem, MenubarMenu,
  MenubarSeparator, MenubarShortcut, MenubarSub,
  MenubarSubContent, MenubarSubTrigger, MenubarTrigger,
} from "@/components/ui/menubar"
>>>>>>> origin/master

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
<<<<<<< HEAD
      <MenubarItem>
        New Tab <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>
        New Window <MenubarShortcut>⌘N</MenubarShortcut>
      </MenubarItem>
=======
      <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
      <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
>>>>>>> origin/master
      <MenubarSeparator />
      <MenubarItem>Print</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent>
<<<<<<< HEAD
      <MenubarItem>
        Undo <MenubarShortcut>⌘Z</MenubarShortcut>
      </MenubarItem>
=======
      <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
>>>>>>> origin/master
      <MenubarSeparator />
      <MenubarSub>
        <MenubarSubTrigger>Find</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem>Search the web</MenubarItem>
          <MenubarItem>Find...</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
    </MenubarContent>
  </MenubarMenu>
<<<<<<< HEAD
</Menubar>;
=======
</Menubar>
>>>>>>> origin/master
```
