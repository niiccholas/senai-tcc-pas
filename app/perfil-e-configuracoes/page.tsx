"use client";

import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { atualizarUsuario } from "../api/usuario";
import styles from "./page.module.css";

export default function ProfileSettingsPage(){
    const { theme, toggleTheme, isDark } = useTheme();
    const { user, isLoggedIn, logout, loading, login } = useUser();
    const router = useRouter();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const confirmationRef = useRef<HTMLDivElement>(null);
    
    // Estados para edição dos dados de cadastro
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        email: '',
        cep: '',
        telefone: '',
        foto: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Redirecionar para login se não estiver logado (apenas após carregamento)
    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.push("/login");
        }
    }, [loading, isLoggedIn, router]);

    // Inicializar dados de edição quando usuário carregar
    useEffect(() => {
        if (user) {
            setEditData({
                email: user.email || '',
                cep: user.cep || '',
                telefone: user.telefone || '',
                foto: user.foto || ''
            });
        }
    }, [user]);

    // Detectar clique fora da confirmação
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (confirmationRef.current && !confirmationRef.current.contains(event.target as Node)) {
                setShowConfirmation(false);
            }
        };

        if (showConfirmation) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showConfirmation]);

    // Função para formatar CPF
    const formatCPF = (cpf: string) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };

    // Função para mostrar confirmação
    const handleLogoutClick = () => {
        setShowConfirmation(true);
    };

    // Função para confirmar logout
    const confirmLogout = () => {
        logout();
        router.push("/login");
    };

    // Função para cancelar logout
    const cancelLogout = () => {
        setShowConfirmation(false);
    };

    // Função para iniciar edição
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Função para cancelar edição
    const handleCancelEdit = () => {
        setIsEditing(false);
        // Restaurar dados originais
        if (user) {
            setEditData({
                email: user.email || '',
                cep: user.cep || '',
                telefone: user.telefone || '',
                foto: user.foto || ''
            });
        }
    };

    // Função para salvar alterações
    const handleSaveEdit = async () => {
        if (!user) return;

        setIsSaving(true);
        try {
            const updatedUser = {
                ...user,
                email: editData.email,
                cep: editData.cep,
                telefone: editData.telefone,
                foto: editData.foto
            };

            await atualizarUsuario(user.id, updatedUser);
            
            // Atualizar contexto com novos dados
            login(updatedUser);
            
            setIsEditing(false);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar alterações. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    // Função para atualizar dados de edição
    const handleInputChange = (field: string, value: string) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Função para lidar com clique na foto
    const handlePhotoClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Função para lidar com seleção de arquivo
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Converter arquivo para base64 ou URL temporária
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setEditData(prev => ({
                    ...prev,
                    foto: result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Mostrar loading enquanto carrega dados do usuário
    if (loading) {
        return <div>Carregando...</div>;
    }

    // Mostrar loading enquanto verifica autenticação
    if (!isLoggedIn) {
        return <div>Redirecionando...</div>;
    }
    
    // URLs dos ícones para cada tema
    const iconUrls = {
        // Dados pessoais
        userVerification: {
            light: "https://file.garden/aOx43sIeICuTJI2s/user-verification%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/Client%20Management.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        },
        idCard: {
            light: "https://file.garden/aOx43sIeICuTJI2s/id-card%20(1)%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/Identification%20Documents.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        },
        worldwide: {
            light: "https://file.garden/aOx43sIeICuTJI2s/worldwide%20(1)%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/Earth%20Planet.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        },
        calendar: {
            light: "https://file.garden/aOx43sIeICuTJI2s/calendar%20(1)%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/Calendar.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        },
        mom: {
            light: "https://file.garden/aOx43sIeICuTJI2s/mom%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/User.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        },
        // Dados de cadastro
        mail: {
            light: "https://file.garden/aOx43sIeICuTJI2s/mail%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/Email.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        },
        pin: {
            light: "https://file.garden/aOx43sIeICuTJI2s/pin%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/Location.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        },
        telephone: {
            light: "https://file.garden/aOx43sIeICuTJI2s/telephone%201.png",
            dark: "https://file.garden/aOx43sIeICuTJI2s/Phone.png" // COLOQUE AQUI A URL DO ÍCONE ESCURO
        }
    };
    
    return(
        <main className={styles.main}>
            <div className={styles.systemSettings}>
                <div className={styles.options}>
                    <div className={styles.photo}>
                    {isDark ? <img src="https://file.garden/aOx43sIeICuTJI2s/nophotodark.png" alt="" /> :
                        <img src="https://file.garden/aOx43sIeICuTJI2s/nophotolight.png" alt="" />}
                    </div> 
                        <ul className={styles.themeOption} onClick={toggleTheme}>
                            <span>Tema</span>
                            <div className={styles.themeToggle}>
                                {isDark ? <img src="https://file.garden/aOx43sIeICuTJI2s/Vector.png" alt="" /> :
                                 <img src="https://file.garden/aOx43sIeICuTJI2s/Moon%20and%20Stars.png" alt="" />}
                            </div>
                        </ul>
                        <ul>
                            <a href="mailto:contato@pas.gov.br?subject=Dúvida sobre o sistema PAS&body=Olá, gostaria de entrar em contato sobre...">Contato</a>
                        </ul>
                        <ul><a href="/termos-de-uso">Termos de uso</a></ul>
                        <ul><a href="/sobre">Sobre</a></ul>
                </div>
                {!showConfirmation ? (
                    <button onClick={handleLogoutClick} className={styles.logoutButton}>
                        Desconectar
                    </button>
                ) : (
                    <div ref={confirmationRef} className={styles.confirmationBox}>
                        <button onClick={cancelLogout} className={styles.cancelButton}>
                            Cancelar
                        </button>
                        <button onClick={confirmLogout} className={styles.confirmButton}>
                            Confirmar
                        </button>
                    </div>
                )}
            </div>
            <div className={styles.accountSettings}>
                <div className={styles.personalData}>
                    <h4>Dados pessoais</h4>
                    <div className={styles.personalContent}>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src={isDark ? iconUrls.userVerification.dark : iconUrls.userVerification.light} alt="" />
                                <div className={styles.label}>
                                    <p>Nome completo</p>
                                    <span>{user?.nome || 'Não informado'}</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src={isDark ? iconUrls.idCard.dark : iconUrls.idCard.light} alt="" />
                                <div className={styles.label}>
                                    <p>CPF</p>
                                    <span>{user?.cpf ? formatCPF(user.cpf) : 'Não informado'}</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src={isDark ? iconUrls.worldwide.dark : iconUrls.worldwide.light} alt="" />
                                <div className={styles.label}>
                                    <p>Naturalidade</p>
                                    <span>{user?.naturalidade || 'Não informado'}</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src={isDark ? iconUrls.calendar.dark : iconUrls.calendar.light} alt="" />
                                <div className={styles.label}>
                                    <p>Nascimento</p>
                                    <span>{user?.nascimento || 'Não informado'}</span>
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.personalInfo}>
                                <img src={isDark ? iconUrls.mom.dark : iconUrls.mom.light} alt="" />
                                <div className={styles.label}>
                                    <p>Nome da Mãe</p>
                                    <span>{user?.nome_mae || 'Não informado'}</span>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
                <div className={styles.registrationData}>
                    <div className={styles.sectionHeader}>
                        <h4>Dados de cadastro</h4>
                        {!isEditing ? (
                            <button onClick={handleEditClick} className={styles.editButton}>
                                Editar
                            </button>
                        ) : (
                            <div className={styles.editActions}>
                                <button onClick={handleCancelEdit} className={styles.cancelButton} disabled={isSaving}>
                                    Cancelar
                                </button>
                                <button onClick={handleSaveEdit} className={styles.saveButton} disabled={isSaving}>
                                    {isSaving ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={styles.registrationContent}>
                        <ul>
                            <div className={styles.registrationInfo}>
                                <img src={isDark ? iconUrls.mail.dark : iconUrls.mail.light} alt="" />
                                <div className={styles.label}>
                                    <p>E-mail</p>
                                    <input 
                                        value={isEditing ? editData.email : (user?.email || '')} 
                                        placeholder="exemploemail@email.com" 
                                        readOnly={!isEditing}
                                        onChange={(e) => isEditing && handleInputChange('email', e.target.value)}
                                        className={isEditing ? styles.editableInput : ''}
                                    />
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.registrationInfo}>
                                <img src={isDark ? iconUrls.pin.dark : iconUrls.pin.light} alt="" />
                                <div className={styles.label}>
                                    <p>Endereço</p>
                                    <input 
                                        value={isEditing ? editData.cep : (user?.cep || '')} 
                                        placeholder="CEP" 
                                        readOnly={!isEditing}
                                        onChange={(e) => isEditing && handleInputChange('cep', e.target.value)}
                                        className={isEditing ? styles.editableInput : ''}
                                    />
                                </div>
                            </div>
                        </ul>
                        <ul>
                            <div className={styles.registrationInfo}>
                                <img src={isDark ? iconUrls.telephone.dark : iconUrls.telephone.light} alt="" />
                                <div className={styles.label}>
                                    <p>Telefone</p>
                                    <input 
                                        value={isEditing ? editData.telefone : (user?.telefone || '')} 
                                        placeholder="(11) 44002-8922" 
                                        readOnly={!isEditing}
                                        onChange={(e) => isEditing && handleInputChange('telefone', e.target.value)}
                                        className={isEditing ? styles.editableInput : ''}
                                    />
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    )
}