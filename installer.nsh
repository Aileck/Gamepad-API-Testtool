!macro customInit
  ReadRegStr $R0 HKCU "Software\${PRODUCT_NAME}" "InstallLocation"
  StrCmp $R0 "" done
  MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION "¡${PRODUCT_NAME} ya está instalado en: $R0! ¿Desea continuar con la instalación?" IDOK done
  Abort
done:
!macroend
