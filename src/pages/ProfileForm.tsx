import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"

import { Button } from "@/components/ui/button.tsx"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card.tsx"
import {useNavigate} from "react-router-dom";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "이름은 최소 2자 이상이어야 합니다.",
    }),
    features: z.string().min(3, {
        message: "특징은 최소 3자 이상이어야 합니다.",
    }),
    bio: z.string().min(10, {
        message: "자기소개는 최소 10자 이상이어야 합니다.",
    }).max(500, {
        message: "자기소개는 500자를 초과할 수 없습니다."
    }),
});

export default function ProfileForm() {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            features: "",
            bio: "",
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        console.log("프로필 이미지:", imageFile);
    }

    function handleBackButton () {
        navigate('/');
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <Button variant={"link"} onClick={handleBackButton}>메인 페이지로 이동하기</Button>
            <CardHeader>
                <CardTitle className="text-center text-2xl">유레카 2기 대면반 프로필</CardTitle>
                <CardDescription className="text-center">
                    유레카 2기 대면반 전용 익명 프로필 등록 양식입니다.
                    여러분의 익명 프로필을 작성해주세요.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex flex-col items-center mb-6">
                            <Avatar className="w-24 h-24 mb-4">
                                <AvatarImage src={profileImage || ""} alt="프로필" />
                                <AvatarFallback className="text-xl">
                                    {form.watch("name")?.charAt(0) || "?"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col items-center">
                                <label
                                    htmlFor="profileImage"
                                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                                >
                                    {profileImage ? "이미지 변경" : "프로필 이미지 업로드"}
                                </label>
                                <input
                                    id="profileImage"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                {profileImage && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setProfileImage(null);
                                            setImageFile(null);
                                        }}
                                        className="text-red-500 hover:text-red-700 mt-1"
                                    >
                                        삭제
                                    </Button>
                                )}
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>이름</FormLabel>
                                    <FormControl>
                                        <Input placeholder="익명 닉네임을 입력하세요" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        유레카 2기 대면반에서 사용할 익명 닉네임입니다.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="features"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>특징</FormLabel>
                                    <FormControl>
                                        <Input placeholder="예: 개발자, 디자이너, 기획자" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        유레카 2기 대면반에서 나를 표현할 수 있는 특징이나 관심사를 입력하세요.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>자기소개</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="유레카 2기 대면반에서 나를 소개할 내용을 작성해주세요..."
                                            {...field}
                                            className="min-h-32"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        유레카 2기 대면반에서 어떤 활동을 하고 싶은지, 어떤 목표가 있는지 간략하게 작성해주세요.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">프로필 생성</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
